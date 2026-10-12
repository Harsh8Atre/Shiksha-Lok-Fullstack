import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AlertCard from '../../components/AlertCard';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import alertService from '../../services/alertService';
import userService from '../../services/userService';
import { useSocketContext } from '../../context/SocketContext';

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [targetGroup, setTargetGroup] = useState('all'); // 'all', 'students', 'teachers'
  const [type, setType] = useState('announcement');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const socket = useSocketContext();

  const fetchData = async () => {
    try {
      const [aRes, uRes] = await Promise.all([
        alertService.getAlerts(),
        userService.getUsers()
      ]);
      setAlerts(aRes.data || aRes || []);
      setUsers(uRes.data || uRes || []);
    } catch (err) {
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSending(true);

    try {
      // Determine recipients based on target group
      let recipients = [];
      if (targetGroup === 'students') {
        recipients = users.filter(u => u.role === 'student').map(u => u._id);
      } else if (targetGroup === 'teachers') {
        recipients = users.filter(u => u.role === 'teacher').map(u => u._id);
      } else {
        // all non-admin users
        recipients = users.map(u => u._id);
      }

      const res = await alertService.createAlert({
        title,
        message,
        type,
        recipients
      });

      const newAlert = res.data || res;
      if (socket && newAlert?._id) {
        socket.emit('send-alert', { alertId: newAlert._id });
      }

      setSuccess(`Platform alert broadcasted to ${recipients.length} user accounts!`);
      setTitle('');
      setMessage('');
      setAlerts(prev => [newAlert, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send broadcast alert');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Platform-Wide Announcements & Broadcasts</h1>

      {error && <ErrorMessage message={error} />}
      {success && (
        <div style={{ padding: '1rem', background: 'var(--success)', color: 'white', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '2rem' }}>
        <Card>
          <h3 style={{ margin: '0 0 1rem 0' }}>Create Broadcast Alert</h3>
          <form onSubmit={handleBroadcast}>
            <Input label="Alert Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Scheduled System Maintenance" required />
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Target Audience</label>
              <select
                className="form-input"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                value={targetGroup}
                onChange={e => setTargetGroup(e.target.value)}
              >
                <option value="all">Entire Platform (All Students & Faculty)</option>
                <option value="students">Students Only</option>
                <option value="teachers">Faculty / Teachers Only</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Type / Severity</label>
              <select
                className="form-input"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="announcement">Announcement (Green)</option>
                <option value="info">Information (Blue)</option>
                <option value="warning">System Warning (Yellow)</option>
                <option value="urgent">Emergency / Urgent (Red)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Broadcast Message</label>
              <textarea
                className="form-input"
                rows="4"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Message displayed to all selected users..."
                required
              ></textarea>
            </div>

            <Button type="submit" variant="primary" loading={sending} style={{ width: '100%' }}>
              Broadcast Alert
            </Button>
          </form>
        </Card>

        <div>
          <h3 style={{ margin: '0 0 1rem 0' }}>All System Alerts History</h3>
          {alerts.length === 0 ? (
            <EmptyState
              title="No alerts created yet"
              message="Platform alerts sent by admins and teachers will appear here."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {alerts.map(alert => (
                <AlertCard key={alert._id} alert={alert} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAlerts;
