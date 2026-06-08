const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  addBloodSugarRecord,
  getBloodSugarRecords,
  getBloodSugarStats,
} = require('../controllers/bloodSugarController');

const router = express.Router();

router.post('/add', authenticateToken, addBloodSugarRecord);
router.get('/records', authenticateToken, getBloodSugarRecords);
router.get('/stats', authenticateToken, getBloodSugarStats);

module.exports = router;
