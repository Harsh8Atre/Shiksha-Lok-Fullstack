import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import useWebRTC from '../../hooks/useWebRTC';
import useChat from '../../hooks/useChat';
import VideoGrid from '../../components/VideoGrid';
import ChatPanel from '../../components/ChatPanel';
import ParticipantList from '../../components/ParticipantList';
import LiveSessionControls from '../../components/LiveSessionControls';
import CameraPermissionModal from '../../components/CameraPermissionModal';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import sessionService from '../../services/sessionService';
import { FiUsers, FiMessageSquare } from 'react-icons/fi';

const StudentLiveClassroom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const socket = useSocketContext();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('chat'); // 'chat' or 'participants'
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [endedMessage, setEndedMessage] = useState('');

  const {
    localStream, remoteStreams, isAudioEnabled, isVideoEnabled,
    toggleAudio, toggleVideo, leaveSession, cleanup, sessionEndedInfo, connectionStatus, error
  } = useWebRTC(socket, roomId, user._id, user.name, false);

  const { messages, sendMessage } = useChat(socket, roomId, roomId);

  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      try {
        const res = await sessionService.getSessionByRoom(roomId);
        const session = res.data || res;
        if (!isMounted) return;
        if (session && (session.status === 'completed' || session.status === 'ended')) {
          cleanup();
          setIsSessionEnded(true);
          setEndedMessage('This live session has already ended.');
        }
      } catch (err) {
        console.warn('Session verification check failed:', err);
      }
    };
    verifySession();
    return () => { isMounted = false; };
  }, [roomId, cleanup]);

  useEffect(() => {
    if (sessionEndedInfo) {
      cleanup();
      setIsSessionEnded(true);
      setEndedMessage(sessionEndedInfo.message || 'The teacher has ended this session.');
    }
  }, [sessionEndedInfo, cleanup]);

  const handleLeave = () => {
    leaveSession();
    navigate('/student/classes');
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
    role: 'student',
    isAudioEnabled,
    isVideoEnabled
  });

  if (isSessionEnded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem' }}>
        <Card style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏹️</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Session Ended</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            {endedMessage || 'The teacher has ended this session.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Button variant="primary" onClick={() => navigate('/student/dashboard')} style={{ width: '100%' }}>
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/student/classes')} style={{ width: '100%' }}>
              View Classes
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
            Connecting to live classroom...
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
          onLeave={handleLeave} 
          isTeacher={false} 
        />
      </div>
      
      <div className="chat-panel">
        <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
          <button 
            style={{ flex: 1, padding: '1rem', background: activePanel === 'chat' ? '#333' : 'transparent', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={() => setActivePanel('chat')}
          ><FiMessageSquare /> Chat</button>
          <button 
            style={{ flex: 1, padding: '1rem', background: activePanel === 'participants' ? '#333' : 'transparent', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={() => setActivePanel('participants')}
          ><FiUsers /> People ({participants.length})</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activePanel === 'chat' ? (
            <ChatPanel messages={messages} onSendMessage={(txt) => sendMessage(txt, user.name, user._id)} currentUserId={user._id} />
          ) : (
            <ParticipantList participants={participants} currentUserId={user._id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLiveClassroom;
