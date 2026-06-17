
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { generateComplaintLetter } = require('../controllers/aiController');

router.post('/complaint-letter/:id', verifyToken, generateComplaintLetter);

module.exports = router;