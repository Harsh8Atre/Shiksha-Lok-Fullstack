import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AlertCard from '../../components/AlertCard';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import courseService from '../../services/courseService';
import alertService from '../../services/alertService';
import { useSocketContext } from '../../context/SocketContext';

const TeacherAlerts = () => {
  const [courses, setCourses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [type, setType] = useState('info');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const socket = useSocketContext();

  const fetchData = async () => {
    try {
      const [cRes, aRes] = await Promise.all([
        courseService.getCourses(),
        alertService.getAlerts()
      ]);
      const courseList = cRes.data || cRes || [];
      const alertList = aRes.data || aRes || [];
      setCourses(courseList);
      setAlerts(alertList);
      if (courseList.length > 0) setCourseId(courseList[0]._id);
    } catch (err) {
      setError('Failed to load alerts data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendAlert = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSending(true);

    try {
      const res = await alertService.createAlert({
        title,
        message,
        type,
        courseId: courseId || undefined
      });
      const newAlert = res.data || res;

      // Real-time socket broadcast
      if (socket && newAlert?._id) {
        socket.emit('send-alert', { alertId: newAlert._id });
      }

      setSuccess('Alert sent successfully to students!');
      setTitle('');
      setMessage('');
      setAlerts(prev => [newAlert, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send alert');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Announcements & Alerts</h1>
      
      {error && <ErrorMessage message={error} />}
      {success && (
        <div style={{ padding: '1rem', background: 'var(--success)', color: 'white', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '2rem' }}>
        <Card>
          <h3 style={{ margin: '0 0 1rem 0' }}>Send New Alert</h3>
          <form onSubmit={handleSendAlert}>
            <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Class Rescheduled / Exam Reminder" required />
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Target Course</label>
              <select
                className="form-input"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
              >
                <option value="">All Enrolled Students</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Priority / Type</label>
              <select
                className="form-input"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="info">Information (Blue)</option>
                <option value="warning">Warning / Reminder (Yellow)</option>
                <option value="urgent">Urgent / Important (Red)</option>
                <option value="announcement">Announcement (Green)</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
              <textarea
                className="form-input"
                rows="4"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your announcement or notice here..."
                required
              ></textarea>
            </div>
            <Button type="submit" variant="primary" loading={sending} style={{ width: '100%' }}>
              Send Real-Time Alert
            </Button>
          </form>
        </Card>
        
        <div>
          <h3 style={{ margin: '0 0 1rem 0' }}>Alerts & Notice History</h3>
          {alerts.length === 0 ? (
            <EmptyState
              title="No alerts sent yet"
              message="Use the form to send real-time alerts and announcements to your students."
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

export default TeacherAlerts;
