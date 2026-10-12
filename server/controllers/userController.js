import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';

export const getUsers = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.role) query.role = req.query.role;
    const users = await User.find(query);
    sendResponse(res, 200, 'Users retrieved', users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    sendResponse(res, 200, 'User retrieved', user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return next(new AppError('Not authorized', 403));
    }
    const updateData = {
      name: req.body.name,
      college: req.body.college,
      phone: req.body.phone,
      profileImage: req.body.profileImage
    };
    if (req.user.role === 'admin' && req.body.role) {
      updateData.role = req.body.role;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!user) return next(new AppError('User not found', 404));
    sendResponse(res, 200, 'User updated', user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    sendResponse(res, 200, 'User deleted', {});
  } catch (error) {
    next(error);
  }
};
