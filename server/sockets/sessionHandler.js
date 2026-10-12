import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';
import Attendance from '../models/Attendance.js';

const roomUsersMap = new Map();
const socketMetaMap = new Map();

export default function(io, socket) {
  socket.on('join-session', async ({ sessionId, roomId }) => {
    try {
      if (!roomId) return;
      
      let sessionDoc = null;
      if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
        sessionDoc = await LiveSession.findById(sessionId);
      }
      if (!sessionDoc) {
        sessionDoc = await LiveSession.findOne({ roomId });
      }

      // If the session has already completed or ended, reject join attempt
      if (sessionDoc && (sessionDoc.status === 'completed' || sessionDoc.status === 'ended')) {
        socket.emit('session-ended', {
          sessionId: sessionDoc._id,
          roomId,
          message: 'This session has already ended.'
        });
        return;
      }

      socket.join(roomId);

      const activeSessionId = sessionDoc ? sessionDoc._id : sessionId;
      socketMetaMap.set(socket.id, { roomId, sessionId: activeSessionId });

      if (!roomUsersMap.has(roomId)) roomUsersMap.set(roomId, new Map());
      roomUsersMap.get(roomId).set(socket.id, {
        userId: socket.user._id,
        name: socket.user.name,
        role: socket.user.role
      });

      if (sessionDoc) {
        await LiveSession.findByIdAndUpdate(sessionDoc._id, {
          $push: {
            participants: {
              userId: socket.user._id,
              socketId: socket.id,
              role: socket.user.role,
              joinedAt: new Date()
            }
          }
        });

        // Attendance recorded only for students
        if (socket.user.role === 'student') {
          const existingAttendance = await Attendance.findOne({
            sessionId: sessionDoc._id,
            studentId: socket.user._id
          });

          if (!existingAttendance) {
            await Attendance.create({
              sessionId: sessionDoc._id,
              classId: sessionDoc.classId,
              studentId: socket.user._id,
              joinedAt: new Date(),
              status: 'present'
            });
          }
        }
      }

      socket.to(roomId).emit('user-joined', {
        socketId: socket.id,
        userId: socket.user._id,
        name: socket.user.name,
        role: socket.user.role
      });

      const currentUsers = Array.from(roomUsersMap.get(roomId).entries()).map(([id, user]) => ({
        socketId: id,
        userId: user.userId,
        name: user.name,
        role: user.role
      }));
      socket.emit('room-users', currentUsers);
    } catch (err) {
      console.error('join-session error:', err);
    }
  });

  socket.on('leave-session', async ({ sessionId, roomId }) => {
    await handleLeave(io, socket, sessionId, roomId);
  });

  socket.on('session-started', ({ roomId }) => {
    socket.to(roomId).emit('session-started');
  });

  socket.on('end-session', ({ roomId, sessionId }) => {
    if (roomId) {
      io.to(roomId).emit('session-ended', {
        roomId,
        sessionId,
        message: 'The teacher has ended this session.'
      });
      roomUsersMap.delete(roomId);
    }
  });

  socket.on('session-ended', ({ roomId, sessionId }) => {
    if (roomId) {
      io.to(roomId).emit('session-ended', {
        roomId,
        sessionId,
        message: 'The teacher has ended this session.'
      });
      roomUsersMap.delete(roomId);
    }
  });

  socket.on('disconnect', async () => {
    const meta = socketMetaMap.get(socket.id);
    if (meta) {
      await handleLeave(io, socket, meta.sessionId, meta.roomId);
      socketMetaMap.delete(socket.id);
    } else {
      for (const [rId, users] of roomUsersMap.entries()) {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          if (users.size === 0) roomUsersMap.delete(rId);
          socket.to(rId).emit('user-left', { socketId: socket.id });
        }
      }
    }
  });
}

async function handleLeave(io, socket, sessionId, roomId) {
  try {
    if (sessionId) {
      await LiveSession.findOneAndUpdate(
        { _id: sessionId, 'participants.socketId': socket.id },
        { $set: { 'participants.$.leftAt': new Date() } }
      );

      if (socket.user && socket.user.role === 'student') {
        const attendance = await Attendance.findOne({
          sessionId,
          studentId: socket.user._id
        });
        if (attendance && !attendance.leftAt) {
          attendance.leftAt = new Date();
          attendance.duration = Math.max(0, Math.floor((attendance.leftAt - attendance.joinedAt) / 1000));
          await attendance.save();
        }
      }
    }

    if (roomId && roomUsersMap.has(roomId)) {
      roomUsersMap.get(roomId).delete(socket.id);
      if (roomUsersMap.get(roomId).size === 0) {
        roomUsersMap.delete(roomId);
      }
      socket.to(roomId).emit('user-left', { socketId: socket.id, userId: socket.user?._id });
      socket.leave(roomId);
    }
  } catch (err) {
    console.error('handleLeave error:', err);
  }
}
