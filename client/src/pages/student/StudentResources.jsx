import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import { FiDownload, FiFileText } from 'react-icons/fi';
import courseService from '../../services/courseService';
import resourceService from '../../services/resourceService';

const StudentResources = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const cRes = await courseService.getCourses();
        const courseList = cRes.data || cRes || [];
        setCourses(courseList);

        // Fetch resources for all enrolled courses
        const resourcePromises = courseList.map(c =>
          resourceService.getCourseResources(c._id)
            .then(res => (res.data || res || []).map(r => ({ ...r, courseTitle: c.title, courseId: c._id })))
            .catch(() => [])
        );

        const allRes = await Promise.all(resourcePromises);
        const flattened = allRes.flat();
        setResources(flattened);
      } catch (err) {
        setError('Failed to load course resources');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader fullPage={false} />;

  const filteredResources = selectedCourseId === 'all'
    ? resources
    : resources.filter(r => r.courseId === selectedCourseId);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>Course Materials & Resources</h1>
        {courses.length > 0 && (
          <select
            style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
          >
            <option value="all">All Enrolled Courses ({resources.length})</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {filteredResources.length === 0 ? (
        <EmptyState
          title="No study materials available"
          message="Your instructors have not uploaded files for this course yet."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredResources.map(res => (
            <Card key={res._id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.75rem', background: 'var(--primary-light)', borderRadius: '8px', color: 'white' }}>
                    <FiFileText size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{res.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {res.courseTitle} &bull; {res.fileType || 'Document'}
                    </div>
                  </div>
                </div>
                {res.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    {res.description}
                  </p>
                )}
              </div>
              <a
                href={res.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                <FiDownload /> Download Resource
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentResources;
