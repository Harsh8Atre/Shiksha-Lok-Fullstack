import React, { useState, useEffect } from 'react';
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
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Card from '../../components/Card';
import sessionService from '../../services/sessionService';
import { FiUsers, FiMessageSquare, FiEye, FiAlertCircle } from 'react-icons/fi';

const TeacherLiveClassroom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const socket = useSocketContext();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('chat'); // chat, participants, monitor
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const [sessionDoc, setSessionDoc] = useState(null);
  const [showConfirmEndModal, setShowConfirmEndModal] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [actionError, setActionError] = useState('');
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [endedMessage, setEndedMessage] = useState('');

  const {
    localStream, remoteStreams, isAudioEnabled, isVideoEnabled,
    toggleAudio, toggleVideo, leaveSession, endSession, cleanup,
    sessionEndedInfo, connectionStatus, error
  } = useWebRTC(socket, roomId, user._id, user.name, true);

  const { messages, sendMessage } = useChat(socket, roomId, roomId);

  useEffect(() => {
    let isMounted = true;
    const fetchSession = async () => {
      try {
        const res = await sessionService.getSessionByRoom(roomId);
        const session = res.data || res;
        if (!isMounted) return;
        setSessionDoc(session);
        if (session && (session.status === 'completed' || session.status === 'ended')) {
          cleanup();
          setIsSessionEnded(true);
          setEndedMessage('This live session has already ended.');
        }
      } catch (err) {
        console.warn('Could not fetch session info:', err);
      }
    };
    fetchSession();
    return () => { isMounted = false; };
  }, [roomId, cleanup]);

  useEffect(() => {
    if (sessionEndedInfo) {
      cleanup();
      setIsSessionEnded(true);
      setEndedMessage(sessionEndedInfo.message || 'The live session has ended.');
    }
  }, [sessionEndedInfo, cleanup]);

  const handlePromptEnd = () => {
    setActionError('');
    setShowConfirmEndModal(true);
  };

  const handleConfirmEndSession = async () => {
    if (isEnding) return;
    setIsEnding(true);
    setActionError('');
    try {
      const targetId = sessionDoc?._id || roomId;
      await sessionService.endSession(targetId);

      // Trigger WebRTC cleanup and socket broadcast
      endSession(targetId);

      setShowConfirmEndModal(false);
      setIsSessionEnded(true);
      setEndedMessage('You have successfully ended this live session for everyone.');
    } catch (err) {
      console.error('Failed to end session:', err);
      setActionError(err.response?.data?.message || 'Failed to end session. Please try again.');
      setIsEnding(false);
    }
  };

  const handleLeaveOnly = () => {
    leaveSession();
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

  if (isSessionEnded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem' }}>
        <Card style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏹️</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Live Class Ended</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            {endedMessage || 'The live class has been ended.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Button variant="primary" onClick={() => navigate('/teacher/classes')} style={{ width: '100%' }}>
              Back to Classes
            </Button>
            <Button variant="outline" onClick={() => navigate('/teacher/dashboard')} style={{ width: '100%' }}>
              Teacher Dashboard
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

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmEndModal}
        onClose={() => !isEnding && setShowConfirmEndModal(false)}
        title="End Live Session"
        size="md"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '500' }}>
            Are you sure you want to end this live session for everyone?
          </p>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            This will immediately disconnect all students, finalize their attendance hours, and mark the class as completed.
          </p>

          {actionError && (
            <div style={{ color: 'var(--danger)', background: '#FEE2E2', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiAlertCircle /> {actionError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button
              variant="outline"
              onClick={() => setShowConfirmEndModal(false)}
              disabled={isEnding}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmEndSession}
              loading={isEnding}
              disabled={isEnding}
            >
              {isEnding ? 'Ending for Everyone...' : 'End Session for Everyone'}
            </Button>
          </div>
        </div>
      </Modal>

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
          onLeave={handleLeaveOnly} 
          onEnd={handlePromptEnd}
          isTeacher={true} 
          isEnding={isEnding}
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
