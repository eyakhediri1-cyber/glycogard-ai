const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { createTables } = require('./db/schema');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bloodSugarRoutes = require('./routes/bloodSugarRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const mentalHealthRoutes = require('./routes/mentalHealthRoutes');
const riskAssessmentRoutes = require('./routes/riskAssessmentRoutes');
const aiCompanionRoutes = require('./routes/aiCompanionRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Initialize database
const initializeDatabase = async () => {
  try {
    await createTables();
    console.log('Database initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blood-sugar', bloodSugarRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/mental-health', mentalHealthRoutes);
app.use('/api/risk-assessment', riskAssessmentRoutes);
app.use('/api/ai-companion', aiCompanionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'GlycoGuard API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

const startServer = () => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GlycoGuard API running on port ${PORT}`);
    initializeDatabase();
  });
};

startServer();

module.exports = app;
