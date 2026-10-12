import Attendance from '../models/Attendance.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';

export const getSessionAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find({ sessionId: req.params.sessionId }).populate('studentId', 'name email college');
    sendResponse(res, 200, 'Attendance retrieved', attendance);
  } catch (error) {
    next(error);
  }
};

export const getStudentAttendance = async (req, res, next) => {
  try {
    if (req.user.role === 'student' && req.user.id !== req.params.studentId) {
      return next(new AppError('Not authorized', 403));
    }
    const attendance = await Attendance.find({ studentId: req.params.studentId }).populate('sessionId').populate('classId', 'title');
    sendResponse(res, 200, 'Attendance retrieved', attendance);
  } catch (error) {
    next(error);
  }
};
