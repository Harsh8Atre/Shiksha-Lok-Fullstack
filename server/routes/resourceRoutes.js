import express from 'express';
import multer from 'multer';
import { uploadResource, getCourseResources, deleteResource } from '../controllers/resourceController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/zip'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

router.use(authenticateUser);

router.post('/', authorizeRoles('teacher'), upload.single('file'), uploadResource);
router.get('/course/:courseId', getCourseResources);
router.delete('/:id', authorizeRoles('teacher', 'admin'), deleteResource);

export default router;
