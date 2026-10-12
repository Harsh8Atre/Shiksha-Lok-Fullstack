import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import useWebRTC from '../../hooks/useWebRTC';
import useChat from '../../hooks/useChat';
import VideoGrid from '../../components/VideoGrid';
import ChatPanel from '../../components/ChatPanel';
import ParticipantList from '../../components/ParticipantList';
import StudentMonitor from '../../components/StudentMonitor';
import LiveSessionControls from '../../components/LiveSessionControls';
import CameraPermissionModal from '../../components/CameraPermissionModal';
import Loader from '../../components/Loader';
import { FiUsers, FiMessageSquare, FiEye } from 'react-icons/fi';

const TeacherLiveClassroom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const socket = useSocketContext();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('chat'); // chat, participants, monitor
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const {
    localStream, remoteStreams, isAudioEnabled, isVideoEnabled,
    toggleAudio, toggleVideo, endSession, connectionStatus, error
  } = useWebRTC(socket, roomId, user._id, user.name, true);

  const { messages, sendMessage } = useChat(socket, roomId, roomId);

  const handleEnd = () => {
    endSession();
    navigate('/teacher/classes');
  };

  const participants = Array.from(remoteStreams.values()).map(p => ({
    userId: p.userId,
    userName: p.userName,
    role: p.role || (p.isTeacher ? 'teacher' : 'student'),
    isAudioEnabled: p.isAudioEnabled,
    isVideoEnabled: p.isVideoEnabled
  }));
  participants.unshift({
    userId: user._id,
    userName: user.name,
    role: 'teacher',
    isAudioEnabled,
    isVideoEnabled
  });

  return (
    <div className="live-classroom" style={{ margin: '-1.5rem', height: 'calc(100vh - 70px)' }}>
      <CameraPermissionModal
        isOpen={Boolean(error) || showPermissionModal}
        error={error}
        onClose={() => setShowPermissionModal(false)}
        onRetry={() => window.location.reload()}
      />

      <div className="video-area">
        {connectionStatus === 'connecting' && (
          <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
            Broadcasting live classroom stream...
          </div>
        )}

        <VideoGrid 
          localStream={localStream} 
          remoteStreams={remoteStreams} 
          localUser={user} 
          isAudioEnabled={isAudioEnabled} 
          isVideoEnabled={isVideoEnabled} 
        />
        <LiveSessionControls 
          isAudioEnabled={isAudioEnabled} 
          isVideoEnabled={isVideoEnabled} 
          onToggleAudio={toggleAudio} 
          onToggleVideo={toggleVideo} 
          onLeave={handleEnd} 
          onEnd={handleEnd}
          isTeacher={true} 
        />
      </div>
      
      <div className="chat-panel">
        <div style={{ display: 'flex', borderBottom: '1px solid #333', fontSize: '0.9rem' }}>
          <button style={{ flex: 1, padding: '1rem 0.5rem', background: activePanel === 'chat' ? '#333' : 'transparent', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }} onClick={() => setActivePanel('chat')}>
            <FiMessageSquare /> Chat
          </button>
          <button style={{ flex: 1, padding: '1rem 0.5rem', background: activePanel === 'participants' ? '#333' : 'transparent', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }} onClick={() => setActivePanel('participants')}>
            <FiUsers /> People ({participants.length})
          </button>
          <button style={{ flex: 1, padding: '1rem 0.5rem', background: activePanel === 'monitor' ? '#333' : 'transparent', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }} onClick={() => setActivePanel('monitor')}>
            <FiEye /> Monitor
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activePanel === 'chat' && <ChatPanel messages={messages} onSendMessage={(txt) => sendMessage(txt, user.name, user._id)} currentUserId={user._id} />}
          {activePanel === 'participants' && <ParticipantList participants={participants} currentUserId={user._id} />}
          {activePanel === 'monitor' && <StudentMonitor participants={participants} />}
        </div>
      </div>
    </div>
  );
};

export default TeacherLiveClassroom;
