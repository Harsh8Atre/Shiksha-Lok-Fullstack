import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { FiVideo, FiMic, FiAlertCircle } from 'react-icons/fi';

const CameraPermissionModal = ({ isOpen, onClose, onRetry, error }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Media Device Access Required">
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: '50%', color: 'white' }}>
            <FiVideo size={28} />
          </div>
          <div style={{ padding: '1rem', background: 'var(--secondary)', borderRadius: '50%', color: 'white' }}>
            <FiMic size={28} />
          </div>
        </div>

        <h4 style={{ margin: '0 0 0.5rem 0' }}>Allow Camera & Microphone</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          ShikshaLok live virtual classroom requires access to your camera and microphone so instructors and classmates can see and hear you during the session.
        </p>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
            <FiAlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          {onRetry && (
            <Button variant="primary" onClick={onRetry} style={{ flex: 1 }}>
              Retry Access
            </Button>
          )}
          <Button variant="outline" onClick={onClose} style={{ flex: 1 }}>
            Continue Anyway / Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CameraPermissionModal;
