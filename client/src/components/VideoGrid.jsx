import React from 'react';
import VideoTile from './VideoTile';

const VideoGrid = ({ localStream, remoteStreams, localUser, isAudioEnabled, isVideoEnabled }) => {
  const remoteEntries = Array.from(remoteStreams.values());
  const totalParticipants = 1 + remoteEntries.length;
  
  // Simple layout logic based on count
  let gridTemplateColumns = '1fr';
  if (totalParticipants === 2) gridTemplateColumns = '1fr 1fr';
  else if (totalParticipants >= 3) gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';

  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns, gap: '1rem', padding: '1rem', overflowY: 'auto' }}>
      <div style={{ minHeight: '200px' }}>
        <VideoTile 
          stream={localStream} 
          name={localUser.name} 
          isLocal={true} 
          isMuted={!isAudioEnabled} 
          isVideoOff={!isVideoEnabled} 
        />
      </div>
      {remoteEntries.map((p) => (
        <div key={p.userId} style={{ minHeight: '200px' }}>
          <VideoTile 
            stream={p.stream} 
            name={p.userName} 
            isLocal={false} 
            isMuted={!p.isAudioEnabled} 
            isVideoOff={!p.isVideoEnabled} 
          />
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
