import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';

export const validateObjectId = (paramName) => {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return next(new AppError(`Invalid ObjectId for ${paramName}`, 400));
    }
    next();
  };
};
