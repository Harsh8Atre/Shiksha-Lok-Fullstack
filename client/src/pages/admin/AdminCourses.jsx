import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import courseService from '../../services/courseService';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await courseService.getCourses({ all: 'true' });
      const list = res.data || res || [];
      setCourses(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course, its scheduled classes, and study materials?')) return;
    try {
      await courseService.deleteCourse(id);
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>All Platform Courses</h1>

      {error && <ErrorMessage message={error} onRetry={fetchCourses} />}

      {courses.length === 0 ? (
        <EmptyState
          title="No courses created yet"
          message="When faculty create courses, they will be listed here for moderation."
        />
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--bg-primary)' }}>
                  <th style={{ padding: '1rem' }}>Course Title</th>
                  <th style={{ padding: '1rem' }}>Subject</th>
                  <th style={{ padding: '1rem' }}>Faculty / Teacher</th>
                  <th style={{ padding: '1rem' }}>Enrolled Students</th>
                  <th style={{ padding: '1rem' }}>Created</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{c.title}</td>
                    <td style={{ padding: '1rem' }}>{c.subject}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{c.teacher?.name || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>{c.students?.length || 0}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteCourse(c._id)}>
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

export default AdminCourses;
