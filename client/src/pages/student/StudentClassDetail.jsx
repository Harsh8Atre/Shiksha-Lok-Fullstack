import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import classService from '../../services/classService';
import resourceService from '../../services/resourceService';
import { formatTime } from '../../utils/constants';

const StudentClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classItem, setClassItem] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await classService.getClass(id);
        const cls = res.data || res;
        setClassItem(cls);

        if (cls.course?._id || cls.course) {
          const cId = cls.course._id || cls.course;
          const rRes = await resourceService.getCourseResources(cId);
          setResources(rRes.data || rRes || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load class details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <Loader fullPage={false} />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!classItem) return <div>Class not found</div>;

  const isLive = classItem.status === 'live';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Button variant="outline" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
        &larr; Back to Classes
      </Button>

      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>{classItem.title}</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Course: <strong>{classItem.course?.title || 'Course'}</strong> | Faculty: <strong>{classItem.teacher?.name || 'Instructor'}</strong>
            </p>
          </div>
          <Badge variant={isLive ? 'danger' : classItem.status === 'completed' ? 'default' : 'warning'}>
            {isLive ? '🔴 LIVE NOW' : classItem.status?.toUpperCase()}
          </Badge>
        </div>

        <div style={{ margin: '2rem 0', background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>📅 Scheduled Date & Time:</strong> {classItem.scheduledAt ? new Date(classItem.scheduledAt).toLocaleString() : 'TBD'}
          </p>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>⏱ Duration:</strong> {classItem.duration || 60} minutes
          </p>
          {classItem.description && (
            <p style={{ margin: '0.75rem 0 0 0' }}>
              <strong>📝 Description / Syllabus:</strong> {classItem.description}
            </p>
          )}
        </div>

        {isLive ? (
          <Button
            variant="success"
            onClick={() => navigate(`/student/live/${classItem.roomId}`)}
            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
          >
            Enter Live Classroom
          </Button>
        ) : classItem.status === 'completed' ? (
          <Button variant="outline" disabled style={{ width: '100%' }}>
            This class session has ended
          </Button>
        ) : (
          <div>
            <Button
              variant="primary"
              onClick={() => navigate(`/student/live/${classItem.roomId}`)}
              style={{ width: '100%' }}
            >
              Enter Classroom (Waiting for Faculty)
            </Button>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              The teacher will start the live stream at the scheduled time.
            </p>
          </div>
        )}
      </Card>

      {resources.length > 0 && (
        <Card>
          <h3 style={{ margin: '0 0 1rem 0' }}>Course Study Materials</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resources.map(r => (
              <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{r.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.fileType}</div>
                </div>
                <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" download style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                  Download
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentClassDetail;
