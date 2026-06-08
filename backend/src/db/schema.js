const pool = require('../db/connection');

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        date_of_birth DATE,
        gender VARCHAR(10),
        weight_kg DECIMAL(5, 2),
        height_cm INTEGER,
        diabetes_type VARCHAR(20),
        diagnosis_year INTEGER,
        smoker BOOLEAN DEFAULT false,
        has_hypertension BOOLEAN DEFAULT false,
        last_eye_exam DATE,
        last_foot_exam DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Blood Sugar Records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blood_sugar_records (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        glucose_level INTEGER NOT NULL,
        measurement_time TIMESTAMP NOT NULL,
        meal_type VARCHAR(20),
        source VARCHAR(50) DEFAULT 'manual', -- 'manual' or 'CGM'
        is_alert BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_bs_user_time ON blood_sugar_records(user_id, measurement_time);
    `);

    // Physical Activity table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS physical_activity (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_type VARCHAR(100) NOT NULL,
        duration_minutes INTEGER NOT NULL,
        intensity VARCHAR(20), -- 'Low', 'Moderate', 'High'
        calories_burned INTEGER,
        activity_date TIMESTAMP NOT NULL,
        wearable_source VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS physical_activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_type TEXT,
        duration_minutes INTEGER,
        intensity VARCHAR(20) CHECK (intensity IN ('low','moderate','high')),
        glucose_impact_estimated REAL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Medical Documents table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medical_documents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        doc_type VARCHAR(50) NOT NULL, -- 'Prescription', 'Lab Result', 'Report'
        file_path TEXT NOT NULL,
        extracted_data JSONB,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Medications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        dosage VARCHAR(100),
        frequency VARCHAR(50),
        start_date DATE,
        end_date DATE,
        renewal_date DATE,
        is_insulin BOOLEAN DEFAULT false,
        insulin_type VARCHAR(50), -- 'Rapid', 'Slow', 'Mixed'
        side_effects TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Nutrition Logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS nutrition_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        meal_name VARCHAR(255) NOT NULL,
        calories INTEGER,
        carbs_g DECIMAL(6, 2),
        protein_g DECIMAL(6, 2),
        fat_g DECIMAL(6, 2),
        log_date DATE NOT NULL,
        meal_time VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_nutrition_user_date ON nutrition_logs(user_id, log_date);
    `);

    // Health Metrics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS health_metrics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        hba1c DECIMAL(4, 2),
        cholesterol INTEGER,
        blood_pressure_systolic INTEGER,
        blood_pressure_diastolic INTEGER,
        bmi DECIMAL(5, 2),
        measurement_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_metrics_user_date ON health_metrics(user_id, measurement_date);
    `);

    // Mental Health Logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mental_health_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
        stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
        sleep_hours DECIMAL(4, 2),
        anxiety_level INTEGER,
        notes TEXT,
        log_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_mental_user_date ON mental_health_logs(user_id, log_date);
    `);

    // AI Companion Chat History table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message_text TEXT NOT NULL,
        response_text TEXT,
        message_type VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_history(user_id, created_at);
    `);

    // Risk Assessments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS risk_assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        risk_type VARCHAR(100),
        risk_score DECIMAL(5, 2),
        risk_level VARCHAR(20),
        recommendations TEXT,
        assessment_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_risk_user_date ON risk_assessments(user_id, assessment_date);

      CREATE TABLE IF NOT EXISTS risk_scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        renal_risk INTEGER,
        retinal_risk INTEGER,
        foot_risk INTEGER,
        global_score INTEGER,
        calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // CGM Readings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cgm_readings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        glucose_value REAL NOT NULL,
        trend TEXT CHECK (trend IN ('stable','rising','falling','rising_fast','falling_fast')),
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_cgm_user_time ON cgm_readings(user_id, recorded_at);
    `);

    // Mood Entries table (New professional schema)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
        stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
        notes TEXT,
        glucose_at_entry REAL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migration: Add new columns to existing tables if they don't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        -- Users table extensions
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='smoker') THEN
          ALTER TABLE users ADD COLUMN smoker BOOLEAN DEFAULT false;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='has_hypertension') THEN
          ALTER TABLE users ADD COLUMN has_hypertension BOOLEAN DEFAULT false;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_eye_exam') THEN
          ALTER TABLE users ADD COLUMN last_eye_exam DATE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_foot_exam') THEN
          ALTER TABLE users ADD COLUMN last_foot_exam DATE;
        END IF;

        -- Medications table extensions
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='medications' AND column_name='renewal_date') THEN
          ALTER TABLE medications ADD COLUMN renewal_date DATE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='medications' AND column_name='is_insulin') THEN
          ALTER TABLE medications ADD COLUMN is_insulin BOOLEAN DEFAULT false;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='medications' AND column_name='insulin_type') THEN
          ALTER TABLE medications ADD COLUMN insulin_type VARCHAR(50);
        END IF;
      END $$;
    `);

    console.log('All tables and migrations completed successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

module.exports = { createTables };
