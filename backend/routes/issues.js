
const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/auth');
const {
  reportIssue,
  getAllIssues,
  getIssue,
  upvoteIssue,
  updateStatus
} = require('../controllers/issueController');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.get('/', getAllIssues);
router.get('/:id', getIssue);
router.post('/', verifyToken, upload.single('image'), reportIssue);
router.post('/:id/upvote', verifyToken, upvoteIssue);
router.patch('/:id/status', verifyToken, updateStatus);

module.exports = router;