import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/CourseCard';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import courseService from '../../services/courseService';

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await courseService.getCourses();
      const list = res.data || res;
      setCourses(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course and its associated classes?')) return;
    try {
      await courseService.deleteCourse(courseId);
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>My Courses</h1>
        <Link to="/teacher/courses/create"><Button variant="primary">+ Create Course</Button></Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchCourses} />}

      {courses.length === 0 ? (
        <EmptyState
          title="No courses created yet"
          message="Start teaching by creating your first course."
          action={{ label: "Create Course", onClick: () => window.location.href = '/teacher/courses/create' }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {courses.map(c => (
            <div key={c._id} style={{ display: 'flex', flexDirection: 'column' }}>
              <CourseCard course={c} isEnrolled={false} showEnroll={false} />
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <Button variant="danger" size="sm" onClick={() => handleDelete(c._id)} style={{ flex: 1 }}>
                  Delete Course
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
