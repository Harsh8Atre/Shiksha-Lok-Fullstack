import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { sendResponse } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, college, phone, role } = req.body;
    if (!name || !email || !password) {
      return next(new AppError('Please provide name, email and password', 400));
    }
    if (password.length < 6) {
      return next(new AppError('Password must be at least 6 characters long', 400));
    }
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return next(new AppError('Email already in use', 400));
    }
    // Strictly only student or teacher can be registered via public endpoint
    const assignedRole = role === 'teacher' ? 'teacher' : 'student';
    if (assignedRole === 'teacher' && (!college || !college.trim())) {
      return next(new AppError('Please provide your college or institutional affiliation for teacher registration', 400));
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      college: college ? college.trim() : '',
      phone: phone ? phone.trim() : '',
      role: assignedRole
    });
    const token = user.getSignedJwtToken();
    user.password = undefined;
    sendResponse(res, 201, 'User registered successfully', { user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return next(new AppError('Invalid credentials', 401));
    }
    const token = user.getSignedJwtToken();
    user.password = undefined;
    sendResponse(res, 200, 'Login successful', { user, token });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    sendResponse(res, 200, 'User data retrieved', { user: req.user });
  } catch (error) {
    next(error);
  }
};
