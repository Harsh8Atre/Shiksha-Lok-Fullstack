import { useState, useEffect, useCallback } from 'react';

export const useChat = (socket, sessionId, roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      setMessages((prev) => {
        // Prevent duplicate messages by checking _id
        if (msg._id && prev.some((m) => m._id === msg._id)) {
          return prev;
        }
        return [...prev, msg];
      });
    };

    socket.on('receive-message', handleReceive);

    return () => {
      socket.off('receive-message', handleReceive);
    };
  }, [socket]);

  const sendMessage = useCallback((text, userName, userId) => {
    if (!text || !text.trim() || !socket) return;
    socket.emit('send-message', {
      sessionId,
      roomId,
      message: text.trim(),
      userName,
      userId
    });
  }, [socket, sessionId, roomId]);

  return { messages, sendMessage, loading };
};

export default useChat;
