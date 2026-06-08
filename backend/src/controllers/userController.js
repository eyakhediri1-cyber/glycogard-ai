const pool = require('../db/connection');

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await pool.query(
      `SELECT id, uuid, email, first_name, last_name, date_of_birth, gender, 
              weight_kg, height_cm, diabetes_type, diagnosis_year, created_at 
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      dateOfBirth: user.date_of_birth,
      gender: user.gender,
      weightKg: user.weight_kg,
      heightCm: user.height_cm,
      diabetesType: user.diabetes_type,
      diagnosisYear: user.diagnosis_year,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { firstName, lastName, weightKg, heightCm, diabetesType, diagnosisYear } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, weight_kg = $3, height_cm = $4,
           diabetes_type = $5, diagnosis_year = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id, uuid, email, first_name, last_name, weight_kg, height_cm`,
      [firstName, lastName, weightKg, heightCm, diabetesType, diagnosisYear, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = { getUserProfile, updateUserProfile };
