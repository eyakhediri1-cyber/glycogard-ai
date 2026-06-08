const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  addMedication,
  getMedications,
  updateMedication,
  deleteMedication,
} = require('../controllers/medicationController');

const router = express.Router();

router.post('/add', authenticateToken, addMedication);
router.get('/list', authenticateToken, getMedications);
router.put('/:medicationId', authenticateToken, updateMedication);
router.delete('/:medicationId', authenticateToken, deleteMedication);

module.exports = router;
