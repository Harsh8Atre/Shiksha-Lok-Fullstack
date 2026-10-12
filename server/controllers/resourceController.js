import Resource from '../models/Resource.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';
import Course from '../models/Course.js';

export const uploadResource = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('Please upload a file', 400));
    
    const course = await Course.findById(req.body.courseId);
    if (!course) return next(new AppError('Course not found', 404));
    if (course.teacher.toString() !== req.user.id) return next(new AppError('Not authorized', 403));

    const resource = await Resource.create({
      courseId: req.body.courseId,
      teacherId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype
    });
    sendResponse(res, 201, 'Resource uploaded', resource);
  } catch (error) {
    next(error);
  }
};

export const getCourseResources = async (req, res, next) => {
  try {
    const resources = await Resource.find({ courseId: req.params.courseId });
    sendResponse(res, 200, 'Resources retrieved', resources);
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return next(new AppError('Resource not found', 404));
    if (req.user.role !== 'admin' && resource.teacherId.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }
    await resource.deleteOne();
    sendResponse(res, 200, 'Resource deleted', {});
  } catch (error) {
    next(error);
  }
};
