import React from 'react';
import Badge from './Badge';

const StudentMonitor = ({ participants }) => {
  const students = participants.filter(p => p.role === 'student');

  return (
    <div style={{ padding: '1rem' }}>
      <h4>Student Monitor</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {students.map(s => (
          <div key={s.userId} style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{s.userName}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Badge variant={s.isAudioEnabled ? 'success' : 'danger'}>Mic</Badge>
              <Badge variant={s.isVideoEnabled ? 'success' : 'danger'}>Cam</Badge>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Online</div>
          </div>
        ))}
        {students.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>No students connected yet.</div>}
      </div>
    </div>
  );
};

export default StudentMonitor;
