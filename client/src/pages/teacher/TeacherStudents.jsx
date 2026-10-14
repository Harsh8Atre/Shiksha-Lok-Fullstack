import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import courseService from '../../services/courseService';

const TeacherStudents = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('all');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await courseService.getCourses();
        const list = res.data || res;
        setCourses(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <Loader fullPage={false} />;

  // Gather students based on filter
  let displayStudents = [];
  const coursesToInspect = selectedCourseId === 'all'
    ? courses
    : courses.filter(c => c._id === selectedCourseId);

  coursesToInspect.forEach(course => {
    if (Array.isArray(course.students)) {
      course.students.forEach(st => {
        if (st && typeof st === 'object') {
          displayStudents.push({
            ...st,
            courseTitle: course.title,
            courseId: course._id,
            college: st.college,
          });
        }
      });
    }
  });

  return (
    <div>
      <div className="responsive-page-header enrolled-students-header">
        <div className="responsive-page-heading">
          <h1>Enrolled Students</h1>
        </div>

        {courses.length > 0 && (
          <div className="enrolled-students-filter">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              aria-label="Filter students by course"
            >
              <option value="all">
                All Courses ({displayStudents.length} enrollments)
              </option>

              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.students?.length || 0})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {displayStudents.length === 0 ? (
        <EmptyState
          title="No students enrolled yet"
          message="When students enroll in your courses, they will appear here."
        />
      ) : (
        <Card>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>College</th>
                  <th style={{ padding: '0.75rem' }}>Course</th>
                </tr>
              </thead>
              <tbody>
                {displayStudents.map((s, idx) => (
                  <tr key={`${s._id}-${idx}`} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{s.name}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{s.email}</td>
                    <td style={{ padding: '0.75rem' }}>{s.college || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-primary)', borderRadius: '4px', fontSize: '0.85rem' }}>
                        {s.courseTitle}
                      </span>
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

export default TeacherStudents;
