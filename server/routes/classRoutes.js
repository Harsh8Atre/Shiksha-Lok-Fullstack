import express from 'express';
import { createClass, getClasses, getClass, updateClass, deleteClass } from '../controllers/classController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.route('/')
  .post(authorizeRoles('teacher', 'admin'), createClass)
  .get(getClasses);

router.route('/:id')
  .get(getClass)
  .put(authorizeRoles('teacher', 'admin'), updateClass)
  .delete(authorizeRoles('teacher', 'admin'), deleteClass);

export default router;
