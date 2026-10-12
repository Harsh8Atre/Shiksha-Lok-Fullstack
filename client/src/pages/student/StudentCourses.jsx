import React, { useState, useEffect } from 'react';
import CourseCard from '../../components/CourseCard';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';

const StudentCourses = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('my'); // 'my' or 'browse'
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const [myRes, allRes] = await Promise.all([
        courseService.getCourses(),
        courseService.getCourses({ all: 'true' })
      ]);
      setMyCourses(myRes.data || myRes || []);
      setAllCourses(allRes.data || allRes || []);
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await courseService.enrollInCourse(courseId);
      await fetchCourses();
      setTab('my');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrollingId(null);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm('Are you sure you want to unenroll from this course?')) return;
    try {
      await courseService.unenrollFromCourse(courseId);
      await fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unenroll');
    }
  };

  if (loading) return <Loader fullPage={false} />;

  const myCourseIds = new Set(myCourses.map(c => c._id));
  const availableToEnroll = allCourses.filter(c => !myCourseIds.has(c._id));

  const filteredMy = myCourses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAvailable = availableToEnroll.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>Courses</h1>
        <input
          type="text"
          placeholder="Search courses or subjects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', minWidth: '240px' }}
        />
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchCourses} />}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <Button variant={tab === 'my' ? 'primary' : 'outline'} onClick={() => setTab('my')}>
          My Enrolled Courses ({myCourses.length})
        </Button>
        <Button variant={tab === 'browse' ? 'primary' : 'outline'} onClick={() => setTab('browse')}>
          Browse All Available ({availableToEnroll.length})
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {tab === 'my' ? (
          filteredMy.length > 0 ? (
            filteredMy.map(c => (
              <div key={c._id} style={{ display: 'flex', flexDirection: 'column' }}>
                <CourseCard course={c} isEnrolled={true} showEnroll={false} />
                <div style={{ marginTop: '0.5rem' }}>
                  <Button variant="outline" size="sm" onClick={() => handleUnenroll(c._id)} style={{ width: '100%', color: 'var(--danger)' }}>
                    Drop / Unenroll Course
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1' }}>
              <EmptyState
                title="No enrolled courses"
                message="You have not enrolled in any courses yet. Switch to Browse Courses to get started!"
                action={{ label: "Browse Courses", onClick: () => setTab('browse') }}
              />
            </div>
          )
        ) : (
          filteredAvailable.length > 0 ? (
            filteredAvailable.map(c => (
              <div key={c._id} style={{ display: 'flex', flexDirection: 'column' }}>
                <CourseCard course={c} showEnroll={false} />
                <div style={{ marginTop: '0.5rem' }}>
                  <Button
                    variant="primary"
                    loading={enrollingId === c._id}
                    onClick={() => handleEnroll(c._id)}
                    style={{ width: '100%' }}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1' }}>
              <EmptyState
                title="No additional courses available"
                message="You are enrolled in all available courses, or no matching courses were found."
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
