const pool = require('../db/connection');

const addMentalHealthLog = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { moodScore, stressLevel, sleepHours, anxietyLevel, notes, logDate } = req.body;

    if (!moodScore || !logDate) {
      return res.status(400).json({ error: 'Mood score and date are required' });
    }

    const result = await pool.query(
      `INSERT INTO mental_health_logs (user_id, mood_score, stress_level, sleep_hours, anxiety_level, notes, log_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, mood_score, stress_level, sleep_hours, anxiety_level, notes, log_date`,
      [userId, moodScore, stressLevel, sleepHours, anxietyLevel, notes, logDate]
    );

    res.status(201).json({
      message: 'Mental health log added',
      log: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding mental health log:', error);
    res.status(500).json({ error: 'Failed to add mental health log' });
  }
};

const getMentalHealthLogs = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT id, mood_score, stress_level, sleep_hours, anxiety_level, notes, log_date, created_at
       FROM mental_health_logs 
       WHERE user_id = $1 AND log_date >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY log_date DESC`,
      [userId]
    );

    res.json({
      count: result.rows.length,
      logs: result.rows,
    });
  } catch (error) {
    console.error('Error fetching mental health logs:', error);
    res.status(500).json({ error: 'Failed to fetch mental health logs' });
  }
};

const getMentalHealthStats = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT 
        ROUND(AVG(mood_score)::numeric, 2) as avg_mood,
        ROUND(AVG(stress_level)::numeric, 2) as avg_stress,
        ROUND(AVG(sleep_hours)::numeric, 2) as avg_sleep,
        ROUND(AVG(anxiety_level)::numeric, 2) as avg_anxiety
       FROM mental_health_logs 
       WHERE user_id = $1 AND log_date >= CURRENT_DATE - INTERVAL '${days} days'`,
      [userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error calculating mental health stats:', error);
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
};

module.exports = {
  addMentalHealthLog,
  getMentalHealthLogs,
  getMentalHealthStats,
};
