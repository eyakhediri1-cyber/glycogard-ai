const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  addMentalHealthLog,
  getMentalHealthLogs,
  getMentalHealthStats,
} = require('../controllers/mentalHealthController');

const router = express.Router();

router.post('/add', authenticateToken, addMentalHealthLog);
router.get('/logs', authenticateToken, getMentalHealthLogs);
router.get('/stats', authenticateToken, getMentalHealthStats);

module.exports = router;
