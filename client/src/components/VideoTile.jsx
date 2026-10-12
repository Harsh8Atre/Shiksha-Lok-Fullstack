import React, { useRef, useEffect } from 'react';
import { FiMicOff, FiVideoOff } from 'react-icons/fi';
import { getInitials } from '../utils/constants';

const VideoTile = ({ stream, name, isLocal, isMuted, isVideoOff }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#222', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {isVideoOff ? (
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
          {getInitials(name)}
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: isLocal ? 'scaleX(-1)' : 'none' }}
        />
      )}
      
      <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {name} {isLocal && '(You)'}
        {isMuted && <FiMicOff color="var(--danger)" size={14} />}
        {isVideoOff && <FiVideoOff color="var(--danger)" size={14} />}
      </div>
    </div>
  );
};

export default VideoTile;
