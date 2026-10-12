import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import classService from '../../services/classService';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const fetchClasses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await classService.getClasses();
      const list = res.data || res || [];
      setClasses(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await classService.deleteClass(id);
      setClasses(classes.filter(c => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete class');
    }
  };

  if (loading) return <Loader fullPage={false} />;

  const filtered = classes.filter(c => {
    if (filter === 'live') return c.status === 'live';
    if (filter === 'scheduled') return c.status === 'scheduled';
    if (filter === 'completed') return c.status === 'completed';
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>All Scheduled & Past Classes</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')}>
            All ({classes.length})
          </Button>
          <Button variant={filter === 'live' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('live')}>
            Live Now ({classes.filter(c => c.status === 'live').length})
          </Button>
          <Button variant={filter === 'scheduled' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('scheduled')}>
            Scheduled ({classes.filter(c => c.status === 'scheduled').length})
          </Button>
          <Button variant={filter === 'completed' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('completed')}>
            Completed ({classes.filter(c => c.status === 'completed').length})
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchClasses} />}

      {filtered.length === 0 ? (
        <EmptyState
          title="No classes found"
          message="No lectures currently match the selected status filter."
        />
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--bg-primary)' }}>
                  <th style={{ padding: '1rem' }}>Class Title</th>
                  <th style={{ padding: '1rem' }}>Course</th>
                  <th style={{ padding: '1rem' }}>Faculty</th>
                  <th style={{ padding: '1rem' }}>Scheduled Time</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(cls => (
                  <tr key={cls._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{cls.title}</td>
                    <td style={{ padding: '1rem' }}>{cls.course?.title || 'Course'}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{cls.teacher?.name || 'Faculty'}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {cls.scheduledAt ? new Date(cls.scheduledAt).toLocaleString() : 'TBD'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Badge variant={cls.status === 'live' ? 'danger' : cls.status === 'completed' ? 'default' : 'warning'}>
                        {cls.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteClass(cls._id)}>
                        Delete
                      </Button>
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

export default AdminClasses;
