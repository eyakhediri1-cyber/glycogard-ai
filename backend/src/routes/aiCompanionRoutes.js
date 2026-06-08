const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { sendMessage, chatHistory } = require('../controllers/aiCompanionController');

const router = express.Router();

router.post('/message', authenticateToken, sendMessage);
router.get('/history', authenticateToken, chatHistory);

module.exports = router;
