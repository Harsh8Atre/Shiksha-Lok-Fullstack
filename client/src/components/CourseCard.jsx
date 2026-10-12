import React from 'react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { FiUsers, FiBook } from 'react-icons/fi';

const CourseCard = ({ course, onEnroll, onView, showEnroll, isEnrolled }) => {
  return (
    <Card hoverable className="course-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{course.title}</h3>
        <Badge variant="info">{course.subject}</Badge>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', minHeight: '40px' }}>
        {course.description?.substring(0, 80)}...
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FiBook /> {course.teacher?.name || 'Instructor'}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FiUsers /> {course.students?.length || 0} students</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {showEnroll && !isEnrolled && (
          <Button variant="primary" onClick={() => onEnroll(course._id)} style={{ flex: 1 }}>Enroll Now</Button>
        )}
        {isEnrolled && (
          <Button variant="outline" style={{ flex: 1 }} disabled>Enrolled</Button>
        )}
        {onView && (
          <Button variant="secondary" onClick={() => onView(course._id)} style={{ flex: 1 }}>View Details</Button>
        )}
      </div>
    </Card>
  );
};

export default CourseCard;
