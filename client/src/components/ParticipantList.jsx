import React from 'react';
import Badge from './Badge';
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from 'react-icons/fi';

const ParticipantList = ({ participants, currentUserId }) => {
  return (
    <div style={{ padding: '1rem' }}>
      <h4 style={{ marginBottom: '1rem' }}>Participants ({participants.length})</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {participants.map(p => (
          <div key={p.userId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                  {p.userName} {p.userId === currentUserId && '(You)'}
                </div>
                <div style={{ fontSize: '0.75rem' }}>
                  <Badge variant={p.role === 'teacher' ? 'warning' : 'default'} size="0.65rem">{p.role}</Badge>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              {p.isAudioEnabled ? <FiMic /> : <FiMicOff color="var(--danger)" />}
              {p.isVideoEnabled ? <FiVideo /> : <FiVideoOff color="var(--danger)" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;
