const pool = require('../db/connection');

const addMedication = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { name, dosage, frequency, startDate, endDate, renewalDate, isInsulin, insulinType, sideEffects } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Medication name is required' });
    }

    const result = await pool.query(
      `INSERT INTO medications (user_id, name, dosage, frequency, start_date, end_date, renewal_date, is_insulin, insulin_type, side_effects)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id, name, dosage, frequency, start_date, end_date, renewal_date, is_insulin, insulin_type, side_effects`,
      [userId, name, dosage, frequency, startDate, endDate, renewalDate, isInsulin, insulinType, sideEffects]
    );

    res.status(201).json({
      message: 'Medication added',
      medication: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding medication:', error);
    res.status(500).json({ error: 'Failed to add medication' });
  }
};

const getMedications = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const result = await pool.query(
      `SELECT id, name, dosage, frequency, start_date, end_date, side_effects, created_at
       FROM medications 
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      count: result.rows.length,
      medications: result.rows,
    });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
};

const updateMedication = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { medicationId } = req.params;
    const { name, dosage, frequency, endDate, sideEffects } = req.body;

    const result = await pool.query(
      `UPDATE medications 
       SET name = COALESCE($1, name), dosage = COALESCE($2, dosage), 
           frequency = COALESCE($3, frequency), end_date = COALESCE($4, end_date),
           side_effects = COALESCE($5, side_effects), updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING id, name, dosage, frequency, start_date, end_date, side_effects`,
      [name, dosage, frequency, endDate, sideEffects, medicationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    res.json({
      message: 'Medication updated',
      medication: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ error: 'Failed to update medication' });
  }
};

const deleteMedication = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { medicationId } = req.params;

    const result = await pool.query(
      `DELETE FROM medications WHERE id = $1 AND user_id = $2 RETURNING id`,
      [medicationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    res.json({ message: 'Medication deleted' });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ error: 'Failed to delete medication' });
  }
};

module.exports = {
  addMedication,
  getMedications,
  updateMedication,
  deleteMedication,
};
