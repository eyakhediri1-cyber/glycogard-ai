const pool = require('../db/connection');

const addBloodSugarRecord = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { glucoseLevel, measurementTime, mealType, notes, source = 'manual' } = req.body;

    if (!glucoseLevel || !measurementTime) {
      return res.status(400).json({ error: 'Glucose level and measurement time are required' });
    }

    // Check for alerts (Medical standard ranges)
    const isAlert = glucoseLevel < 70 || glucoseLevel > 250;

    const result = await pool.query(
      `INSERT INTO blood_sugar_records (user_id, glucose_level, measurement_time, meal_type, notes, source, is_alert)
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, glucose_level, measurement_time, meal_type, notes, source, is_alert`,
      [userId, glucoseLevel, measurementTime, mealType, notes, source, isAlert]
    );

    res.status(201).json({
      message: 'Blood sugar record added',
      record: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding blood sugar record:', error);
    res.status(500).json({ error: 'Failed to add blood sugar record' });
  }
};

const getBloodSugarRecords = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT id, glucose_level, measurement_time, meal_type, notes, created_at
       FROM blood_sugar_records 
       WHERE user_id = $1 AND measurement_time >= NOW() - INTERVAL '${days} days'
       ORDER BY measurement_time DESC`,
      [userId]
    );

    res.json({
      count: result.rows.length,
      records: result.rows,
    });
  } catch (error) {
    console.error('Error fetching blood sugar records:', error);
    res.status(500).json({ error: 'Failed to fetch blood sugar records' });
  }
};

const getBloodSugarStats = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { days = 30 } = req.query;

    // Advanced CGM Stats: TIR (Time In Range 70-180 mg/dL), Estimated HbA1c
    const statsResult = await pool.query(
      `WITH readings AS (
        SELECT glucose_level 
        FROM blood_sugar_records 
        WHERE user_id = $1 AND measurement_time >= NOW() - INTERVAL '${days} days'
      ),
      tir_calc AS (
        SELECT 
          COUNT(*) FILTER (WHERE glucose_level BETWEEN 70 AND 180) * 100.0 / NULLIF(COUNT(*), 0) as tir_score,
          AVG(glucose_level) as avg_g
        FROM readings
      )
      SELECT 
        ROUND(avg_g::numeric, 2) as average_glucose,
        ROUND(tir_score::numeric, 1) as tir_percentage,
        ROUND(((avg_g + 46.7) / 28.7)::numeric, 2) as estimated_hba1c, -- Formula: (Avg + 46.7) / 28.7
        (SELECT MIN(glucose_level) FROM readings) as min_glucose,
        (SELECT MAX(glucose_level) FROM readings) as max_glucose,
        (SELECT COUNT(*) FROM readings) as total_readings
      FROM tir_calc`,
      [userId]
    );

    res.json(statsResult.rows[0]);
  } catch (error) {
    console.error('Error calculating blood sugar stats:', error);
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
};

module.exports = {
  addBloodSugarRecord,
  getBloodSugarRecords,
  getBloodSugarStats,
};
