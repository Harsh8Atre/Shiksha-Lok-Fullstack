import express from 'express';
import { createAlert, getAlerts, markAsRead } from '../controllers/alertController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.post('/', authorizeRoles('teacher', 'admin'), createAlert);
router.get('/', getAlerts);
router.put('/:id/read', markAsRead);

export default router;
