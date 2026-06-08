# GlycoGuard Backend

AI-powered diabetes management platform backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL credentials and OpenAI API key

4. Start PostgreSQL and create database:
```bash
createdb glycoguard_db
```

5. Run the server:
```bash
npm run dev
```

6. Seed sample data:
```bash
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Blood Sugar
- `POST /api/blood-sugar/add` - Add blood sugar record
- `GET /api/blood-sugar/records` - Get blood sugar records
- `GET /api/blood-sugar/stats` - Get blood sugar statistics

### Medications
- `POST /api/medications/add` - Add medication
- `GET /api/medications/list` - Get all medications
- `PUT /api/medications/:medicationId` - Update medication
- `DELETE /api/medications/:medicationId` - Delete medication

### Nutrition
- `POST /api/nutrition/add` - Log meal
- `GET /api/nutrition/logs` - Get nutrition logs
- `GET /api/nutrition/stats` - Get nutrition statistics

### Mental Health
- `POST /api/mental-health/add` - Log mental health data
- `GET /api/mental-health/logs` - Get mental health logs
- `GET /api/mental-health/stats` - Get mental health statistics

### Risk Assessment
- `POST /api/risk-assessment/assess` - Perform health risk assessment
- `GET /api/risk-assessment/assessments` - Get risk assessments
- `GET /api/risk-assessment/insights` - Get AI insights

### AI Companion
- `POST /api/ai-companion/message` - Send message to AI companion
- `GET /api/ai-companion/history` - Get chat history

## Tech Stack
- Express.js
- PostgreSQL
- JWT Authentication
- OpenAI API Integration
