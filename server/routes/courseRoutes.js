import express from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse, enrollStudent, unenrollStudent } from '../controllers/courseController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.route('/')
  .post(authorizeRoles('teacher', 'admin'), createCourse)
  .get(getCourses);

router.route('/:id')
  .get(getCourse)
  .put(authorizeRoles('teacher', 'admin'), updateCourse)
  .delete(authorizeRoles('teacher', 'admin'), deleteCourse);

router.post('/:id/enroll', authorizeRoles('student'), enrollStudent);
router.delete('/:id/enroll', authorizeRoles('student'), unenrollStudent);
router.post('/:id/unenroll', authorizeRoles('student'), unenrollStudent);

export default router;
