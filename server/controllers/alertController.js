import Alert from '../models/Alert.js';
import Course from '../models/Course.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';

export const createAlert = async (req, res, next) => {
  try {
    req.body.sender = req.user.id;
    if (req.body.courseId && (!req.body.recipients || req.body.recipients.length === 0)) {
      const course = await Course.findById(req.body.courseId);
      if (course) {
        req.body.recipients = course.students;
      }
    }
    const alert = await Alert.create(req.body);
    sendResponse(res, 201, 'Alert created', alert);
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'admin') {
      // Admin sees all alerts
    } else if (req.user.role === 'teacher') {
      // Teacher sees alerts they sent or received
      query = { $or: [{ sender: req.user.id }, { recipients: req.user.id }] };
    } else {
      // Student sees alerts targeted to them
      query = { recipients: req.user.id };
    }
    const alerts = await Alert.find(query).populate('sender', 'name').sort({ createdAt: -1 });
    sendResponse(res, 200, 'Alerts retrieved', alerts);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, {
      $addToSet: { readBy: req.user.id }
    }, { new: true });
    if (!alert) return next(new AppError('Alert not found', 404));
    sendResponse(res, 200, 'Alert marked as read', alert);
  } catch (error) {
    next(error);
  }
};
