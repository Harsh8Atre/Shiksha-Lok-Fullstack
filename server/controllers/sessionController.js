import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';
import Class from '../models/Class.js';
import Attendance from '../models/Attendance.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';

export const createSession = async (req, res, next) => {
  try {
    const { classId } = req.body;
    const cls = await Class.findById(classId);
    if (!cls) return next(new AppError('Class not found', 404));
    if (cls.teacher.toString() !== req.user.id) return next(new AppError('Not authorized', 403));
    
    let session = await LiveSession.findOne({ classId, status: 'active' });
    if (!session) {
      session = await LiveSession.create({
        classId,
        teacherId: req.user.id,
        roomId: cls.roomId,
        participants: [{ userId: req.user.id, role: 'teacher' }]
      });
      cls.status = 'live';
      await cls.save();
    }
    sendResponse(res, 201, 'Session created/retrieved', session);
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'teacher') query.teacherId = req.user.id;
    const sessions = await LiveSession.find(query)
      .populate('classId', 'title')
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });
    sendResponse(res, 200, 'Sessions retrieved', sessions);
  } catch (error) {
    next(error);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const session = await LiveSession.findById(req.params.id)
      .populate('classId', 'title course scheduledAt')
      .populate('teacherId', 'name email')
      .populate('participants.userId', 'name email');
    if (!session) return next(new AppError('Session not found', 404));
    sendResponse(res, 200, 'Session retrieved', session);
  } catch (error) {
    next(error);
  }
};

export const getSessionByRoom = async (req, res, next) => {
  try {
    const session = await LiveSession.findOne({ roomId: req.params.roomId })
      .populate('classId', 'title course scheduledAt')
      .populate('teacherId', 'name email')
      .populate('participants.userId', 'name email');
    if (!session) return next(new AppError('Session not found for this room', 404));
    sendResponse(res, 200, 'Session retrieved', session);
  } catch (error) {
    next(error);
  }
};

export const startSession = async (req, res, next) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return next(new AppError('Session not found', 404));
    if (session.teacherId.toString() !== req.user.id) return next(new AppError('Not authorized', 403));
    session.startedAt = new Date();
    session.status = 'active';
    await session.save();
    sendResponse(res, 200, 'Session started', session);
  } catch (error) {
    next(error);
  }
};

export const endSession = async (req, res, next) => {
  try {
    let session;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      session = await LiveSession.findById(req.params.id);
    }
    if (!session) {
      session = await LiveSession.findOne({ roomId: req.params.id });
    }
    if (!session) return next(new AppError('Session not found', 404));

    // Verify authorized teacher or admin
    if (session.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to end this session', 403));
    }

    // Safe and idempotent if already completed/ended
    if (session.status === 'completed' || session.status === 'ended') {
      return sendResponse(res, 200, 'Session already ended', session);
    }
    
    session.endedAt = new Date();
    session.status = 'completed';
    session.participants.forEach(p => {
      if (!p.leftAt) p.leftAt = new Date();
    });
    await session.save();

    // Update parent Class status
    const cls = await Class.findById(session.classId);
    if (cls) {
      cls.status = 'completed';
      await cls.save();
    }

    // Finalize all open student attendance records for this session
    const openAttendances = await Attendance.find({ sessionId: session._id, leftAt: null });
    for (const att of openAttendances) {
      att.leftAt = new Date();
      att.duration = Math.max(0, Math.floor((att.leftAt - att.joinedAt) / 1000));
      await att.save();
    }

    // Broadcast session-ended to all participants in this live room
    const io = req.app.get('io');
    if (io) {
      io.to(session.roomId).emit('session-ended', {
        sessionId: session._id,
        roomId: session.roomId,
        message: 'The teacher has ended this session.'
      });
    }

    sendResponse(res, 200, 'Session ended successfully', session);
  } catch (error) {
    next(error);
  }
};
