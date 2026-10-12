import React from 'react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { formatDate, formatTime, CLASS_STATUS } from '../utils/constants';
import { FiClock, FiCalendar } from 'react-icons/fi';

const ClassCard = ({ classItem, onJoin, showJoin }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case CLASS_STATUS.LIVE: return <Badge variant="danger">LIVE NOW</Badge>;
      case CLASS_STATUS.SCHEDULED: return <Badge variant="info">Scheduled</Badge>;
      case CLASS_STATUS.COMPLETED: return <Badge variant="success">Completed</Badge>;
      case CLASS_STATUS.CANCELLED: return <Badge variant="default">Cancelled</Badge>;
      default: return null;
    }
  };

  return (
    <Card hoverable className="class-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0 }}>{classItem.title}</h4>
        {getStatusBadge(classItem.status)}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        <strong>Course:</strong> {classItem.course?.title || 'Unknown Course'}
      </div>
      <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <FiCalendar /> {formatDate(classItem.scheduledAt)}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <FiClock /> {formatTime(classItem.scheduledAt)}
        </span>
      </div>
      {showJoin && classItem.status === CLASS_STATUS.LIVE && (
        <Button variant="primary" onClick={() => onJoin(classItem._id)} style={{ width: '100%' }}>
          Join Class
        </Button>
      )}
    </Card>
  );
};

export default ClassCard;
