import express from 'express';
import { createSession, getSessions, getSession, getSessionByRoom, startSession, endSession } from '../controllers/sessionController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', authorizeRoles('teacher'), createSession);
router.get('/', getSessions);
router.get('/room/:roomId', getSessionByRoom);
router.get('/:id', getSession);
router.route('/:id/start')
  .post(authorizeRoles('teacher'), startSession)
  .put(authorizeRoles('teacher'), startSession);
router.route('/:id/end')
  .post(authorizeRoles('teacher'), endSession)
  .put(authorizeRoles('teacher'), endSession);

export default router;
