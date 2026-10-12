import React, { useState, useEffect } from 'react';
import AlertCard from '../../components/AlertCard';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import { useSocketContext } from '../../context/SocketContext';
import alertService from '../../services/alertService';

const StudentAlerts = () => {
  const { user } = useAuth();
  const socket = useSocketContext();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread'
  const [error, setError] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await alertService.getAlerts();
      const list = res.data || res || [];
      setAlerts(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Listen for real-time alerts from Socket.IO
  useEffect(() => {
    if (!socket) return;
    const handleReceiveAlert = (newAlert) => {
      setAlerts(prev => [newAlert, ...prev]);
    };
    socket.on('receive-alert', handleReceiveAlert);
    return () => {
      socket.off('receive-alert', handleReceiveAlert);
    };
  }, [socket]);

  const handleMarkRead = async (alertId) => {
    try {
      await alertService.markAlertAsRead(alertId);
      setAlerts(alerts.map(a => {
        if (a._id === alertId) {
          const readBy = a.readBy || [];
          return { ...a, readBy: [...readBy, user._id] };
        }
        return a;
      }));
    } catch (err) {
      console.error('Failed to mark alert as read', err);
    }
  };

  if (loading) return <Loader fullPage={false} />;

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'unread') {
      return !a.readBy || !a.readBy.includes(user?._id);
    }
    return true;
  });

  const unreadCount = alerts.filter(a => !a.readBy || !a.readBy.includes(user?._id)).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Announcements & Alerts</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            {unreadCount > 0 ? `${unreadCount} unread announcement${unreadCount > 1 ? 's' : ''}` : 'You are all caught up!'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')}>
            All ({alerts.length})
          </Button>
          <Button variant={filter === 'unread' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('unread')}>
            Unread ({unreadCount})
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchAlerts} />}

      {filteredAlerts.length === 0 ? (
        <EmptyState
          title="No alerts to display"
          message={filter === 'unread' ? "You have read all notifications." : "Important notices from your teachers will appear here."}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAlerts.map(alert => (
            <AlertCard
              key={alert._id}
              alert={alert}
              onMarkRead={() => handleMarkRead(alert._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAlerts;
