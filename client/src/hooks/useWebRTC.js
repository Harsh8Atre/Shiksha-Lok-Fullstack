import { useState, useEffect, useRef, useCallback } from 'react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export const useWebRTC = (socket, roomId, userId, userName, isTeacher) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [error, setError] = useState(null);

  const localStreamRef = useRef(null);
  const peerConnections = useRef(new Map()); // socketId -> { pc, queue: [], user }

  const createPeerConnection = useCallback((targetSocketId, targetUser) => {
    if (peerConnections.current.has(targetSocketId)) {
      return peerConnections.current.get(targetSocketId).pc;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    const entry = { pc, queue: [], user: targetUser };
    peerConnections.current.set(targetSocketId, entry);

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('webrtc-ice-candidate', {
          targetSocketId,
          candidate: event.candidate
        });
      }
    };

    // Remote stream received
    pc.ontrack = (event) => {
      const stream = event.streams[0] || new MediaStream([event.track]);
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        const existing = next.get(targetSocketId) || {};
        next.set(targetSocketId, {
          stream,
          socketId: targetSocketId,
          userId: targetUser?.userId || existing.userId,
          userName: targetUser?.userName || targetUser?.name || existing.userName || 'Participant',
          role: targetUser?.role || existing.role || 'student',
          isAudioEnabled: existing.isAudioEnabled !== undefined ? existing.isAudioEnabled : true,
          isVideoEnabled: existing.isVideoEnabled !== undefined ? existing.isVideoEnabled : true
        });
        return next;
      });
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        // Peer disconnected
      }
    };

    return pc;
  }, [socket]);

  useEffect(() => {
    if (!socket || !roomId) return;

    let mounted = true;

    const initMedia = async () => {
      try {
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, frameRate: 15 },
            audio: true
          });
        } catch (mediaErr) {
          console.warn('Full media request failed, attempting audio only:', mediaErr);
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            setIsVideoEnabled(false);
          } catch (audioErr) {
            console.error('All media devices failed or denied:', audioErr);
            setError('Unable to access camera or microphone. Check browser permissions.');
            setConnectionStatus('failed');
            return;
          }
        }

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);
        setConnectionStatus('connected');

        // Join the session room
        socket.emit('join-session', { roomId });
      } catch (err) {
        if (!mounted) return;
        console.error('Media access error:', err);
        setError('Could not access camera/microphone');
        setConnectionStatus('failed');
      }
    };

    initMedia();

    // 1. Existing users in room (we initiate offer to each)
    const handleRoomUsers = async (users) => {
      for (const peer of users) {
        if (peer.socketId === socket.id) continue;
        try {
          const pc = createPeerConnection(peer.socketId, peer);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('webrtc-offer', {
            targetSocketId: peer.socketId,
            sdp: offer
          });
        } catch (e) {
          console.error('Failed to create offer for peer:', peer.socketId, e);
        }
      }
    };

    // 2. Incoming offer from another peer
    const handleOffer = async ({ from, sdp, userId: rUserId, userName: rUserName, role: rRole }) => {
      try {
        const pc = createPeerConnection(from, { userId: rUserId, userName: rUserName, role: rRole });
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));

        // Flush queued candidates
        const entry = peerConnections.current.get(from);
        if (entry && entry.queue.length > 0) {
          for (const cand of entry.queue) {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          }
          entry.queue = [];
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('webrtc-answer', {
          targetSocketId: from,
          sdp: answer
        });
      } catch (e) {
        console.error('Failed handling offer from:', from, e);
      }
    };

    // 3. Incoming answer
    const handleAnswer = async ({ from, sdp }) => {
      try {
        const entry = peerConnections.current.get(from);
        if (entry && entry.pc) {
          await entry.pc.setRemoteDescription(new RTCSessionDescription(sdp));
          // Flush queued candidates
          if (entry.queue.length > 0) {
            for (const cand of entry.queue) {
              await entry.pc.addIceCandidate(new RTCIceCandidate(cand));
            }
            entry.queue = [];
          }
        }
      } catch (e) {
        console.error('Failed handling answer from:', from, e);
      }
    };

    // 4. Incoming ICE candidate
    const handleCandidate = async ({ from, candidate }) => {
      try {
        const entry = peerConnections.current.get(from);
        if (entry && entry.pc && entry.pc.remoteDescription && entry.pc.remoteDescription.type) {
          await entry.pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else if (entry) {
          entry.queue.push(candidate);
        }
      } catch (e) {
        console.error('Error adding ICE candidate:', e);
      }
    };

    // 5. User left
    const handleUserLeft = ({ socketId }) => {
      const entry = peerConnections.current.get(socketId);
      if (entry) {
        entry.pc.close();
        peerConnections.current.delete(socketId);
      }
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        next.delete(socketId);
        return next;
      });
    };

    // 6. Media state change
    const handleMediaStateChange = ({ socketId, audio, video }) => {
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        const existing = next.get(socketId);
        if (existing) {
          next.set(socketId, {
            ...existing,
            isAudioEnabled: audio !== undefined ? audio : existing.isAudioEnabled,
            isVideoEnabled: video !== undefined ? video : existing.isVideoEnabled
          });
        }
        return next;
      });
    };

    // 7. Session ended
    const handleSessionEnded = () => {
      cleanup();
    };

    socket.on('room-users', handleRoomUsers);
    socket.on('webrtc-offer', handleOffer);
    socket.on('webrtc-answer', handleAnswer);
    socket.on('webrtc-ice-candidate', handleCandidate);
    socket.on('user-left', handleUserLeft);
    socket.on('media-state-change', handleMediaStateChange);
    socket.on('session-ended', handleSessionEnded);

    return () => {
      mounted = false;
      socket.off('room-users', handleRoomUsers);
      socket.off('webrtc-offer', handleOffer);
      socket.off('webrtc-answer', handleAnswer);
      socket.off('webrtc-ice-candidate', handleCandidate);
      socket.off('user-left', handleUserLeft);
      socket.off('media-state-change', handleMediaStateChange);
      socket.off('session-ended', handleSessionEnded);
      cleanup();
    };
  }, [socket, roomId, createPeerConnection]);

  const cleanup = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);

    peerConnections.current.forEach(({ pc }) => {
      try {
        pc.close();
      } catch (e) {
        // ignore
      }
    });
    peerConnections.current.clear();
    setRemoteStreams(new Map());
  }, []);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        socket?.emit('media-state-change', {
          roomId,
          audio: audioTrack.enabled,
          video: isVideoEnabled
        });
      }
    }
  }, [socket, roomId, isVideoEnabled]);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        socket?.emit('media-state-change', {
          roomId,
          audio: isAudioEnabled,
          video: videoTrack.enabled
        });
      }
    }
  }, [socket, roomId, isAudioEnabled]);

  const leaveSession = useCallback(() => {
    cleanup();
    socket?.emit('leave-session', { roomId });
  }, [socket, roomId, cleanup]);

  const endSession = useCallback(() => {
    if (isTeacher) {
      socket?.emit('session-ended', { roomId });
      cleanup();
    }
  }, [socket, roomId, isTeacher, cleanup]);

  return {
    localStream,
    remoteStreams,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    leaveSession,
    endSession,
    connectionStatus,
    error
  };
};

export default useWebRTC;
