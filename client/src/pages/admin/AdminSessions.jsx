import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import sessionService from '../../services/sessionService';

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await sessionService.getSessions();
      const list = res.data || res || [];
      setSessions(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) return <Loader fullPage={false} />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Live Session History & Logs</h1>

      {error && <ErrorMessage message={error} onRetry={fetchSessions} />}

      {sessions.length === 0 ? (
        <EmptyState
          title="No live sessions recorded"
          message="Live classrooms initiated by teachers will appear in this audit log."
        />
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--bg-primary)' }}>
                  <th style={{ padding: '1rem' }}>Class Title</th>
                  <th style={{ padding: '1rem' }}>Host / Teacher</th>
                  <th style={{ padding: '1rem' }}>Room ID</th>
                  <th style={{ padding: '1rem' }}>Participants</th>
                  <th style={{ padding: '1rem' }}>Started At</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{s.classId?.title || 'Lecture Session'}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{s.teacherId?.name || 'Instructor'}</td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{s.roomId}</td>
                    <td style={{ padding: '1rem' }}>{s.participants?.length || 0} users</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {s.startedAt ? new Date(s.startedAt).toLocaleString() : new Date(s.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Badge variant={s.status === 'active' ? 'danger' : 'default'}>
                        {s.status === 'active' ? '🔴 ACTIVE' : 'ENDED'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminSessions;
