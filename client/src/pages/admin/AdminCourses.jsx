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
    if (
      !window.confirm(
        'Delete this course, its scheduled classes, and study materials?'
      )
    ) {
      return;
    }

    try {
      await courseService.deleteCourse(id);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== id)
      );
    } catch (err) {
      window.alert(
        err.response?.data?.message || 'Failed to delete course'
      );
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <section className="admin-courses-page">
      <h1 className="admin-courses-title">All Platform Courses</h1>

      {error && (
        <ErrorMessage message={error} onRetry={fetchCourses} />
      )}

      {courses.length === 0 ? (
        <EmptyState
          title="No courses created yet"
          message="When faculty create courses, they will be listed here for moderation."
        />
      ) : (
        <Card style={{ padding: 0, minWidth: 0, maxWidth: '100%' }}>
          <div
            className="table-responsive admin-courses-table-wrapper"
            role="region"
            aria-label="All platform courses"
            tabIndex={0}
          >
            <table className="admin-courses-table">
              <thead>
                <tr>
                  <th scope="col">Course Title</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Faculty / Teacher</th>
                  <th scope="col">Enrolled Students</th>
                  <th scope="col">Created</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td className="admin-course-title-cell">
                      {course.title}
                    </td>
                    <td>{course.subject}</td>
                    <td className="admin-course-teacher-cell">
                      {course.teacher?.name || 'N/A'}
                    </td>
                    <td>{course.students?.length || 0}</td>
                    <td className="admin-course-date-cell">
                      {course.createdAt
                        ? new Date(course.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="admin-course-actions-cell">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteCourse(course._id)}
                      >
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
    </section>
  );
};

export default AdminCourses;