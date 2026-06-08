const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  addNutritionLog,
  getNutritionLogs,
  getNutritionStats,
} = require('../controllers/nutritionController');

const router = express.Router();

router.post('/add', authenticateToken, addNutritionLog);
router.get('/logs', authenticateToken, getNutritionLogs);
router.get('/stats', authenticateToken, getNutritionStats);

module.exports = router;
