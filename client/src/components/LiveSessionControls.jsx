import React from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff, FiSquare } from 'react-icons/fi';
import Button from './Button';

const LiveSessionControls = ({ isAudioEnabled, isVideoEnabled, onToggleAudio, onToggleVideo, onLeave, onEnd, isTeacher, isEnding = false }) => {
  return (
    <div style={{ background: '#111', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
      <button 
        onClick={onToggleAudio}
        disabled={isEnding}
        style={{ 
          width: '50px', height: '50px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: isAudioEnabled ? '#333' : 'var(--danger)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {isAudioEnabled ? <FiMic size={24} /> : <FiMicOff size={24} />}
      </button>
      <button 
        onClick={onToggleVideo}
        disabled={isEnding}
        style={{ 
          width: '50px', height: '50px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: isVideoEnabled ? '#333' : 'var(--danger)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {isVideoEnabled ? <FiVideo size={24} /> : <FiVideoOff size={24} />}
      </button>
      
      <div style={{ width: '1px', height: '30px', background: '#333', margin: '0 1rem' }}></div>
      
      <Button variant="danger" onClick={onLeave} disabled={isEnding} style={{ borderRadius: '24px', padding: '0.5rem 1.5rem' }}>
        <FiPhoneOff /> Leave
      </Button>
      
      {isTeacher && (
        <Button 
          variant="danger" 
          onClick={onEnd} 
          loading={isEnding}
          disabled={isEnding}
          style={{ borderRadius: '24px', padding: '0.5rem 1.5rem', marginLeft: '0.5rem' }}
        >
          <FiSquare /> {isEnding ? 'Ending Session...' : 'End Session'}
        </Button>
      )}
    </div>
  );
};

export default LiveSessionControls;
