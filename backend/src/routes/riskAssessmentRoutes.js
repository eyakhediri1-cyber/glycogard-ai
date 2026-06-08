const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  assessHealthRisk,
  getRiskAssessments,
  getAIInsights,
} = require('../controllers/riskAssessmentController');

const router = express.Router();

router.post('/assess', authenticateToken, assessHealthRisk);
router.get('/assessments', authenticateToken, getRiskAssessments);
router.get('/insights', authenticateToken, getAIInsights);

module.exports = router;
