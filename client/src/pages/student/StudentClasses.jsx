import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClassCard from '../../components/ClassCard';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import classService from '../../services/classService';

const StudentClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'live', 'upcoming', 'completed'
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  if (loading) return <Loader fullPage={false} />;

  const filtered = classes.filter(c => {
    if (filter === 'live') return c.status === 'live';
    if (filter === 'upcoming') return c.status === 'scheduled';
    if (filter === 'completed') return c.status === 'completed';
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>Class Schedule & Lectures</h1>
        <div className="filter-buttons">
          <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')}>
            All ({classes.length})
          </Button>
          <Button variant={filter === 'live' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('live')}>
            🔴 Live Now ({classes.filter(c => c.status === 'live').length})
          </Button>
          <Button variant={filter === 'upcoming' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('upcoming')}>
            Upcoming ({classes.filter(c => c.status === 'scheduled').length})
          </Button>
          <Button variant={filter === 'completed' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('completed')}>
            Completed ({classes.filter(c => c.status === 'completed').length})
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchClasses} />}

      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${filter !== 'all' ? filter : ''} classes found`}
          message="Classes scheduled by your course faculty will appear here."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(cls => (
            <div key={cls._id} style={{ display: 'flex', flexDirection: 'column' }}>
              <ClassCard
                classItem={cls}
                showJoin={cls.status === 'live'}
                onJoin={() => navigate(`/student/live/${cls.roomId}`)}
              />
              <div style={{ marginTop: '0.5rem' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/student/class/${cls._id}`)}
                  style={{ width: '100%' }}
                >
                  View Lecture Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentClasses;
