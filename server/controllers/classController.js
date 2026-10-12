import Class from '../models/Class.js';
import Course from '../models/Course.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';

export const createClass = async (req, res, next) => {
  try {
    const course = await Course.findById(req.body.course);
    if (!course) return next(new AppError('Course not found', 404));
    if (req.user.role !== 'admin' && course.teacher.toString() !== req.user.id) {
      return next(new AppError('Not authorized to add class to this course', 403));
    }
    req.body.teacher = req.user.id;
    const newClass = await Class.create(req.body);
    sendResponse(res, 201, 'Class created', newClass);
  } catch (error) {
    next(error);
  }
};

export const getClasses = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.course) query.course = req.query.course;
    if (req.query.teacher) query.teacher = req.query.teacher;
    if (req.user.role === 'student') {
      const courses = await Course.find({ students: req.user.id }).select('_id');
      query.course = { $in: courses.map(c => c._id) };
    }
    const classes = await Class.find(query).populate('course', 'title').populate('teacher', 'name email');
    sendResponse(res, 200, 'Classes retrieved', classes);
  } catch (error) {
    next(error);
  }
};

export const getClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id).populate('course', 'title').populate('teacher', 'name email');
    if (!cls) return next(new AppError('Class not found', 404));
    sendResponse(res, 200, 'Class retrieved', cls);
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req, res, next) => {
  try {
    let cls = await Class.findById(req.params.id);
    if (!cls) return next(new AppError('Class not found', 404));
    if (req.user.role !== 'admin' && cls.teacher.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }
    cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    sendResponse(res, 200, 'Class updated', cls);
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return next(new AppError('Class not found', 404));
    if (req.user.role !== 'admin' && cls.teacher.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }
    await cls.deleteOne();
    sendResponse(res, 200, 'Class deleted', {});
  } catch (error) {
    next(error);
  }
};
