import React from 'react';
import Card from './Card';
import { FiInfo, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const AlertCard = ({ alert, onMarkRead }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'warning': return <FiAlertTriangle color="var(--warning)" size={24} />;
      case 'success': return <FiCheckCircle color="var(--success)" size={24} />;
      default: return <FiInfo color="var(--info)" size={24} />;
    }
  };

  return (
    <Card className="alert-card" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <h4 style={{ margin: 0, color: alert.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{alert.title}</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
            {new Date(alert.createdAt).toLocaleString()}
          </span>
        </div>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{alert.message}</p>
        {!alert.read && onMarkRead && (
          <button 
            onClick={() => onMarkRead(alert._id)}
            style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
          >
            Mark as read
          </button>
        )}
      </div>
    </Card>
  );
};

export default AlertCard;
