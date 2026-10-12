import express from 'express';
import { getSessionAttendance, getStudentAttendance } from '../controllers/attendanceController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/session/:sessionId', getSessionAttendance);
router.get('/student/:studentId', getStudentAttendance);

export default router;
