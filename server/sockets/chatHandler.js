import mongoose from 'mongoose';
import ChatMessage from '../models/ChatMessage.js';
import LiveSession from '../models/LiveSession.js';

export default function(io, socket) {
  socket.on('send-message', async ({ sessionId, roomId, message }) => {
    try {
      if (!message || !message.trim()) return;

      let validSessionId = null;
      if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
        validSessionId = sessionId;
      } else if (roomId) {
        const session = await LiveSession.findOne({ roomId, status: 'active' });
        if (session) validSessionId = session._id;
      }

      let chatMessage = null;
      if (validSessionId) {
        chatMessage = await ChatMessage.create({
          sessionId: validSessionId,
          sender: socket.user._id,
          message: message.trim()
        });
      }

      io.to(roomId).emit('receive-message', {
        _id: chatMessage ? chatMessage._id : new mongoose.Types.ObjectId().toString(),
        sender: { _id: socket.user._id, name: socket.user.name },
        message: message.trim(),
        createdAt: chatMessage ? chatMessage.createdAt : new Date()
      });
    } catch (err) {
      console.error('Error in send-message:', err);
    }
  });
}
