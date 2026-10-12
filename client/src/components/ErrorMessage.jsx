import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import Button from './Button';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
      <FiAlertCircle size={48} style={{ marginBottom: '1rem' }} />
      <p style={{ marginBottom: '1rem' }}>{message || 'An unexpected error occurred.'}</p>
      {onRetry && <Button variant="outline" onClick={onRetry}>Retry</Button>}
    </div>
  );
};

export default ErrorMessage;
