import React from 'react';
import Button from './Button';

const EmptyState = ({ icon, title, message, action }) => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
        {icon}
      </div>
      <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
        {message}
      </p>
      {action && (
        <Button onClick={action.onClick} variant={action.variant || 'primary'}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
