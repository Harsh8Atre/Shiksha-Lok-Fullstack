import Course from '../models/Course.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';
import Class from '../models/Class.js';
import Resource from '../models/Resource.js';

export const createCourse = async (req, res, next) => {
  try {
    req.body.teacher = req.user.id;
    const course = await Course.create(req.body);
    sendResponse(res, 201, 'Course created', course);
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'teacher') {
      if (req.query.all !== 'true') query.teacher = req.user.id;
    } else if (req.user.role === 'student') {
      if (req.query.all !== 'true') query.students = req.user.id;
    }
    
    if (req.query.teacher) query.teacher = req.query.teacher;
    if (req.query.subject) query.subject = req.query.subject;
    
    const courses = await Course.find(query).populate('teacher', 'name email').populate('students', 'name email');
    sendResponse(res, 200, 'Courses retrieved', courses);
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name email').populate('students', 'name email');
    if (!course) return next(new AppError('Course not found', 404));
    sendResponse(res, 200, 'Course retrieved', course);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));
    if (req.user.role !== 'admin' && course.teacher.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    sendResponse(res, 200, 'Course updated', course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));
    if (req.user.role !== 'admin' && course.teacher.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }
    await course.deleteOne();
    await Class.deleteMany({ course: req.params.id });
    await Resource.deleteMany({ courseId: req.params.id });
    sendResponse(res, 200, 'Course deleted', {});
  } catch (error) {
    next(error);
  }
};

export const enrollStudent = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));
    if (course.students.includes(req.user.id)) {
      return next(new AppError('Already enrolled', 400));
    }
    course.students.push(req.user.id);
    await course.save();
    sendResponse(res, 200, 'Enrolled successfully', course);
  } catch (error) {
    next(error);
  }
};

export const unenrollStudent = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));
    course.students = course.students.filter(s => s.toString() !== req.user.id);
    await course.save();
    sendResponse(res, 200, 'Unenrolled successfully', course);
  } catch (error) {
    next(error);
  }
};
