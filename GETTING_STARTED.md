# GlycoGuard - Getting Started Guide

## 🚀 Quick Start

### Option 1: Docker (Recommended - Easiest)

```bash
# Navigate to project folder
cd /home/eya/GlycoGuard

# Start everything with one command
docker-compose up -d

# Wait 30 seconds for services to initialize

# Access the application:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# Database: localhost:5432
```

### Option 2: Manual Setup

#### Prerequisites
- Node.js 16+ installed
- PostgreSQL 12+ running
- OpenAI API key (optional)

#### Backend Setup
```bash
cd /home/eya/GlycoGuard/backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# - Update database credentials if needed
# - Add OpenAI API key (optional)

# Create database
createdb glycoguard_db

# Seed with demo data
npm run seed

# Start server (dev mode with auto-reload)
npm run dev

# Or production
npm start
```

#### Frontend Setup (new terminal)
```bash
cd /home/eya/GlycoGuard/frontend

# Install dependencies
npm install

# Start development server
npm start

# Browser will open at http://localhost:3000
```

---

## 🔐 Login Credentials (Demo Account)

After initial setup, login with:
```
Email: demo@glycoguard.com
Password: password123
```

---

## 📋 What's Included

### Backend API
✅ Complete REST API with 30+ endpoints
✅ PostgreSQL database with 8 tables
✅ JWT authentication
✅ OpenAI integration for AI companion
✅ Health risk assessment algorithm
✅ Realistic seed data with 30+ entries per table

### Frontend Application
✅ 7 complete pages with full functionality
✅ Real-time data visualization
✅ Responsive mobile-friendly design
✅ Beautiful gradient UI
✅ Toast notifications

### Deployment
✅ Docker & Docker Compose configuration
✅ Production-ready setup
✅ Environment variable management
✅ Secure password hashing

---

## 🎯 Features Overview

### 1. Dashboard (Home Page)
- Welcome message with user's first name
- Quick stats cards: Blood Glucose, Mental Health, Nutrition, Health Status
- Quick action buttons for rapid logging
- Recent trends chart

**Try it**: Click dashboard cards to see details

### 2. Blood Sugar Tracking
- Log glucose readings with meal type
- View all historical readings
- Color-coded risk indicators (Low/Normal/Good/High)
- 30-day statistics (average, min, max)

**Try it**: Add a reading between 70-180 mg/dL

### 3. Nutrition Logging
- Log meals with calories and macros
- Daily nutrition summary
- Meal type categorization (Breakfast, Lunch, Dinner, Snack)
- Average tracking over 30 days

**Try it**: Log a meal like "Grilled Chicken with Rice - 450 calories"

### 4. Mental Well-being
- Mood tracking (1-10 scale with emojis)
- Stress level assessment
- Sleep hours logging
- Anxiety level tracking

**Try it**: Rate your mood and stress for the day

### 5. Medication Management
- Track all medications
- Dosage and frequency
- Side effects documentation
- Add/edit/delete medications

**Try it**: View the pre-loaded medications

### 6. Health Risk Assessment
- AI-powered risk scoring (0-100)
- Risk levels: Low → Moderate → High → Critical
- Personalized health recommendations
- Risk factors analysis

**Try it**: Click "Run New Assessment" to get your score

### 7. AI Companion (🤖)
- Chat with AI health assistant
- Context-aware responses
- Personalized guidance based on your data
- Full chat history

**Try it**: Ask "How can I manage my blood sugar better?"

---

## 📊 Sample Data Included

The database comes pre-seeded with realistic data:

### Blood Sugar (15 readings)
- Range: 135-220 mg/dL (variety of good and elevated readings)
- Spans 6 days with multiple daily readings
- Includes Before/After meal indications

### Medications (3 entries)
- Metformin 500mg (common Type 2 medication)
- Lisinopril 10mg (blood pressure)
- Atorvastatin 20mg (cholesterol)

### Nutrition (6 meals)
- Variety of meal types with realistic macros
- Tracks calories, carbs, protein, fat spread over 6 days

### Mental Health (6 entries)
- Varying mood scores (5-8 out of 10)
- Sleep patterns (6-8 hours)
- Stress and anxiety levels

### Health Metrics
- Current: HbA1c 7.8, Cholesterol 210, BP 138/85, BMI 26.8
- Previous: HbA1c 7.2 (showing improvement)

---

## 🔧 API Testing

### Test with curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","firstName":"Test","lastName":"User","diabetesType":"2"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@glycoguard.com","password":"password123"}'

# Get profile (use token from login response)
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get blood sugar records
curl -X GET http://localhost:5000/api/blood-sugar/records \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add blood sugar reading
curl -X POST http://localhost:5000/api/blood-sugar/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"glucoseLevel":145,"measurementTime":"2026-05-06T08:00:00","mealType":"Before meal"}'
```

---

## 🗄️ Database

### Credentials
- Host: localhost
- Port: 5432
- Database: glycoguard_db
- User: glycoguard
- Password: glycoguard123

### Connect with psql:
```bash
psql -h localhost -U glycoguard -d glycoguard_db

# View tables
\dt

# Example query
SELECT * FROM users;
SELECT * FROM blood_sugar_records LIMIT 10;
```

---

## 🚨 Common Issues & Solutions

### Issue: "Database connection refused"
```bash
# Check if PostgreSQL is running
sudo systemctl start postgresql

# Or if using Docker:
docker-compose up db
```

### Issue: "Cannot find module"
```bash
cd backend  # or frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 5000 already in use"
```bash
# Find process using port
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Issue: "CORS error" in browser console
```bash
# Make sure backend is running
# Check REACT_APP_API_URL matches backend port
# Verify backend has CORS enabled (it does by default)
```

---

## 📈 Next Steps

### Enhance the Application:

1. **Add Email Notifications**
   ```javascript
   // Send alerts for high glucose readings
   npm install nodemailer
   ```

2. **Add Mobile App**
   ```bash
   expo init glycoguard-mobile
   # Use same API endpoints
   ```

3. **Healthcare Provider Portal**
   - Add doctor login
   - Show patient list
   - View patient analytics

4. **Advanced Analytics**
   - AI trend analysis
   - Predictive glucose forecasting
   - Correlation detection

5. **Integrations**
   - Wearable devices (Fitbit, Apple Watch)
   - Electronic health records
   - Insurance portals

---

## 📚 Project Structure Files

```
GlycoGuard/
├── README.md                 # Main documentation
├── GETTING_STARTED.md       # This file
├── docker-compose.yml       # Multi-container setup
├── .gitignore              # Git ignore rules
│
├── backend/
│   ├── src/
│   │   ├── server.js       # Express app entry
│   │   ├── db/
│   │   │   ├── connection.js
│   │   │   └── schema.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── controllers/    # Business logic
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── bloodSugarController.js
│   │   │   ├── medicationController.js
│   │   │   ├── nutritionController.js
│   │   │   ├── mentalHealthController.js
│   │   │   ├── aiCompanionController.js
│   │   │   └── riskAssessmentController.js
│   │   ├── routes/         # API endpoints
│   │   └── scripts/
│   │       └── seed.js     # Demo data
│   ├── .env.example
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   ├── pages/          # Full pages
    │   ├── components/     # React components
    │   ├── services/       # API client
    │   └── styles/         # CSS files
    ├── public/
    │   └── index.html
    ├── package.json
    ├── Dockerfile
    └── README.md
```

---

## 🎓 Learning Resources

### Key Technologies:
- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **JWT Auth**: https://jwt.io/introduction/
- **OpenAI API**: https://platform.openai.com/docs/

---

## 💡 Tips for Best Experience

1. **First Time**: Use Docker Compose for simplicity
2. **Development**: Use `npm run dev` for auto-reload
3. **Testing**: Use the demo account credentials
4. **Data**: Refresh page if you don't see newly added data
5. **Debug**: Check browser console (F12) for API errors
6. **Logs**: View `docker-compose logs backend` for server logs

---

## 🎉 You're Ready!

Your complete GlycoGuard platform is ready. Start by:
1. Logging in with demo credentials
2. Exploring the Dashboard
3. Adding test data to each feature
4. Testing the AI Companion
5. Running a health risk assessment

**Questions?** Check the README.md files in each directory!

Happy coding! 🚀

---

**GlycoGuard** - Empowering patients to manage diabetes with AI-driven insights.
