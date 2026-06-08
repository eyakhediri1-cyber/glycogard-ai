const pool = require('../db/connection');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const seedDatabase = async () => {
  try {
    console.log('Seeding database with realistic data...');

    // Create test user
    const passwordHash = await bcrypt.hash('password123', 10);
    const userUuid = uuidv4();

    const userResult = await pool.query(
      `INSERT INTO users (uuid, email, password_hash, first_name, last_name, date_of_birth, gender, weight_kg, height_cm, diabetes_type, diagnosis_year)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING id`,
      [userUuid, 'demo@glycoguard.com', passwordHash, 'Ahmed', 'Hassan', '1972-05-15', 'M', 85, 178, '2', 2012]
    );

    const userId = userResult.rows[0].id;
    console.log(`Created test user with ID: ${userId}`);

    // Add blood sugar records (realistic values)
    const bloodSugarValues = [
      { glucose: 145, time: '2026-05-06 08:00:00' },
      { glucose: 210, time: '2026-05-06 12:15:00' },
      { glucose: 165, time: '2026-05-06 16:30:00' },
      { glucose: 155, time: '2026-05-06 20:45:00' },
      { glucose: 138, time: '2026-05-05 08:00:00' },
      { glucose: 198, time: '2026-05-05 12:00:00' },
      { glucose: 172, time: '2026-05-05 18:00:00' },
      { glucose: 142, time: '2026-05-04 08:30:00' },
      { glucose: 215, time: '2026-05-04 13:00:00' },
      { glucose: 168, time: '2026-05-04 19:00:00' },
      { glucose: 135, time: '2026-05-03 07:45:00' },
      { glucose: 202, time: '2026-05-03 12:30:00' },
      { glucose: 178, time: '2026-05-03 17:00:00' },
      { glucose: 150, time: '2026-05-02 08:15:00' },
      { glucose: 220, time: '2026-05-02 14:00:00' },
    ];

    for (const { glucose, time } of bloodSugarValues) {
      await pool.query(
        `INSERT INTO blood_sugar_records (user_id, glucose_level, measurement_time, meal_type, notes)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, glucose, time, Math.random() > 0.5 ? 'Before meal' : 'After meal', 'Regular monitoring']
      );
    }
    console.log('Added blood sugar records');

    // Add medications
    const medications = [
      { name: 'Metformin', dosage: '850mg', frequency: 'Twice daily', sideEffects: 'Mild nausea' },
      { name: 'Lantus', dosage: '14U', frequency: 'Once daily at night', sideEffects: 'None reported' },
    ];

    for (const med of medications) {
      await pool.query(
        `INSERT INTO medications (user_id, name, dosage, frequency, start_date, side_effects)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, med.name, med.dosage, med.frequency, '2024-01-15', med.sideEffects]
      );
    }
    console.log('Added medications');

    // Add nutrition logs
    const meals = [
      { name: 'Breakfast - Oatmeal with berries', calories: 320, carbs: 52, protein: 12, fat: 8 },
      { name: 'Lunch - Grilled chicken & vegetables', calories: 450, carbs: 35, protein: 40, fat: 12 },
      { name: 'Dinner - Salmon with brown rice', calories: 520, carbs: 45, protein: 35, fat: 18 },
      { name: 'Snack - Apple with almond butter', calories: 180, carbs: 25, protein: 6, fat: 9 },
      { name: 'Breakfast - Egg white omelet', calories: 250, carbs: 20, protein: 20, fat: 10 },
      { name: 'Lunch - Turkey sandwich', calories: 380, carbs: 40, protein: 30, fat: 10 },
    ];

    const dates = ['2026-05-06', '2026-05-05', '2026-05-04', '2026-05-03', '2026-05-02', '2026-05-01'];

    for (let i = 0; i < meals.length; i++) {
      await pool.query(
        `INSERT INTO nutrition_logs (user_id, meal_name, calories, carbs_g, protein_g, fat_g, log_date, meal_time)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [userId, meals[i].name, meals[i].calories, meals[i].carbs, meals[i].protein, meals[i].fat, dates[Math.floor(i / 2)], ['Breakfast', 'Lunch', 'Dinner', 'Snack'][i % 4]]
      );
    }
    console.log('Added nutrition logs');

    // Add mental health logs
    const mentalHealthData = [
      { mood: 7, stress: 5, sleep: 7.5, anxiety: 3, date: '2026-05-06' },
      { mood: 6, stress: 7, sleep: 6.5, anxiety: 5, date: '2026-05-05' },
      { mood: 8, stress: 4, sleep: 8, anxiety: 2, date: '2026-05-04' },
      { mood: 5, stress: 8, sleep: 6, anxiety: 6, date: '2026-05-03' },
      { mood: 7, stress: 5, sleep: 7.5, anxiety: 3, date: '2026-05-02' },
      { mood: 6, stress: 6, sleep: 7, anxiety: 4, date: '2026-05-01' },
    ];

    for (const data of mentalHealthData) {
      await pool.query(
        `INSERT INTO mental_health_logs (user_id, mood_score, stress_level, sleep_hours, anxiety_level, log_date, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, data.mood, data.stress, data.sleep, data.anxiety, data.date, 'Daily wellness check-in']
      );
    }
    console.log('Added mental health logs');

    // Add health metrics
    await pool.query(
      `INSERT INTO health_metrics (user_id, hba1c, cholesterol, blood_pressure_systolic, blood_pressure_diastolic, bmi, measurement_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, 7.8, 210, 138, 85, 26.8, '2026-05-01']
    );

    await pool.query(
      `INSERT INTO health_metrics (user_id, hba1c, cholesterol, blood_pressure_systolic, blood_pressure_diastolic, bmi, measurement_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, 7.2, 195, 132, 80, 26.8, '2026-04-01']
    );

    console.log('Added health metrics');

    // Add risk assessment
    await pool.query(
      `INSERT INTO risk_assessments (user_id, risk_type, risk_score, risk_level, recommendations, assessment_date)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, 'Comprehensive Health', 45, 'Moderate', 'Continue current medication regimen. Focus on reducing stress and maintaining consistent exercise routine. Schedule regular doctor visits.', '2026-05-06']
    );

    console.log('Added risk assessment');

    console.log('✓ Database seeded successfully!');
    console.log('\nTest credentials:');
    console.log('Email: demo@glycoguard.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
