# GlycoGuard - AI-Powered Diabetes Management Platform

A complete, production-ready full-stack application that helps type 2 diabetes patients detect health risks early and receive personalized AI companion support for daily lifestyle management.

## Features

✨ **Core Features:**
- 📊 **Blood Sugar Tracking** - Log and monitor glucose levels with historical data and trends
- 🍽️ **Nutrition Logging** - Track meals with calorie and macronutrient information
- 😊 **Mental Well-being** - Log mood, stress levels, sleep, and anxiety
- 💊 **Medication Management** - Track medications, dosages, and side effects
- ⚠️ **Health Risk Assessment** - AI-powered risk scoring and personalized recommendations
- 🤖 **AI Companion** - Conversational AI assistant for personalized health guidance
- 📈 **Analytics & Insights** - Dashboard with charts and health statistics
- 🔐 **Secure Authentication** - JWT-based user authentication

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **AI Integration**: OpenAI API
- **Deployment**: Docker, Docker Compose

### Frontend
- **UI Framework**: React 18
- **Routing**: React Router v6
- **Charting**: Chart.js & React-ChartJS-2
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Styling**: CSS3 with responsive design

## Project Structure

```
GlycoGuard/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth & error handling
│   │   ├── db/              # Database connection & schema
│   │   ├── scripts/         # Database seeding
│   │   └── server.js        # Express app entry point
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages/screens
│   │   ├── components/      # Reusable components
│   │   ├── styles/          # CSS stylesheets
│   │   ├── services/        # API client
│   │   ├── App.js           # Main app component
│   │   └── index.js         # React entry point
│   ├── public/              # Static assets
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml       # Multi-container orchestration
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 16+ or Docker & Docker Compose
- PostgreSQL 12+ (if not using Docker)
- OpenAI API Key (optional, for AI features)

### Setup with Docker (Easiest)

```bash
# 1. Clone/navigate to project
cd GlycoGuard

# 2. Set environment variables
export OPENAI_API_KEY="your-api-key-here"

# 3. Start all services
docker-compose up -d

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# Database: localhost:5432
```

### Manual Setup

#### Backend Setup
```bash
cd backend

# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 3. Create and seed database
createdb glycoguard_db
npm run seed

# 4. Start server
npm run dev  # Development mode
npm start    # Production mode
```

#### Frontend Setup
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Set environment variables
export REACT_APP_API_URL=http://localhost:5000/api

# 3. Start development server
npm start
```

## Demo Credentials

After seeding the database, login with:
- **Email**: demo@glycoguard.com
- **Password**: password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### User Profile
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile

### Blood Sugar (requires auth)
- `POST /api/blood-sugar/add` - Add glucose record
- `GET /api/blood-sugar/records?days=30` - Get records
- `GET /api/blood-sugar/stats?days=30` - Get statistics

### Medications (requires auth)
- `POST /api/medications/add` - Add medication
- `GET /api/medications/list` - List all
- `PUT /api/medications/:id` - Update
- `DELETE /api/medications/:id` - Delete

### Nutrition (requires auth)
- `POST /api/nutrition/add` - Log meal
- `GET /api/nutrition/logs` - Get logs
- `GET /api/nutrition/stats` - Get statistics

### Mental Health (requires auth)
- `POST /api/mental-health/add` - Log wellness data
- `GET /api/mental-health/logs` - Get logs
- `GET /api/mental-health/stats` - Get statistics

### Risk Assessment (requires auth)
- `POST /api/risk-assessment/assess` - Perform assessment
- `GET /api/risk-assessment/assessments` - Get history
- `GET /api/risk-assessment/insights` - Get AI insights

### AI Companion (requires auth)
- `POST /api/ai-companion/message` - Send message
- `GET /api/ai-companion/history` - Get chat history

## Sample Data

The seeding script creates realistic data including:
- 30+ blood sugar readings (135-220 mg/dL)
- 6 medication entries
- 6 nutrition logs with macro tracking
- 6 mental health entries with mood/stress/sleep tracking
- 2 health metrics records
- 1 comprehensive risk assessment

## Configuration

### Backend Environment Variables
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/glycoguard_db
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk-your-api-key
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Database Schema

- **users** - User profiles and authentication
- **blood_sugar_records** - Glucose measurements
- **medications** - Medication information
- **nutrition_logs** - Meal and nutrition data
- **health_metrics** - Clinical measurements (HbA1c, cholesterol, BP)
- **mental_health_logs** - Mood, stress, sleep tracking
- **chat_history** - AI companion conversations
- **risk_assessments** - Health risk evaluations

## Features In Detail

### 1. Blood Sugar Tracking
- Log readings before/after meals or anytime
- View color-coded risk status (Low/Normal/Good/High)
- 30-day statistics and trends
- Automatic alerts for out-of-range values

### 2. Nutrition Management
- Log meals with calories and macros
- Daily nutrition summary
- 30-day averages
- Supports all meal types

### 3. Mental Wellness
- Daily mood and stress tracking (1-10 scale)
- Sleep hours logging
- Anxiety assessment
- Personal wellness notes

### 4. Medication Tracking
- Complete medication inventory
- Dosage and frequency tracking
- Side effects documentation
- Start/end date management

### 5. Health Risk Assessment
- Comprehensive algorithmic risk scoring (0-100)
- Risk levels: Low, Moderate, High, Critical
- AI-generated personalized recommendations
- Historical assessment tracking

### 6. AI Companion
- Real-time conversational AI
- Context-aware responses based on user data
- Personalized health guidance
- Chat history preservation

## Deployment

### Docker Deployment
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Cloud Deployment Options

#### AWS
```bash
# Using ECS Fargate
aws ecs create-task-definition ...
aws ecs create-service ...
```

#### Heroku
```bash
heroku create glycoguard
git push heroku main
```

#### DigitalOcean
```bash
doctl apps create --spec app.yaml
```

## Performance Optimizations

- Indexed database queries for faster lookups
- Connection pooling for database efficiency
- React component memoization to prevent re-renders
- Lazy loading for charts and large datasets
- API response caching where appropriate

## Security Features

- Bcrypt password hashing
- JWT token authentication
- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- Secure HTTP-only cookies (when deployed)

## Testing

### Backend Tests
```bash
npm test
```

### Frontend Tests
```bash
npm test
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
psql -U glycoguard -d glycoguard_db -c "SELECT 1;"

# Reset database
dropdb glycoguard_db && createdb glycoguard_db
npm run seed
```

### Port Already in Use
```bash
# Change ports in docker-compose.yml or:
lsof -i :5000  # Find what's using port
kill -9 <PID>
```

### API Connection Issues
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running on configured port

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check logs: `docker-compose logs`

## Future Enhancements

- 📱 Mobile app (React Native)
- 🏥 Healthcare provider integration
- 📧 Email notifications
- 📊 Advanced Analytics & Reports
- 🗣️ Multi-language support
- 🔔 SMS alerts for critical readings
- 👥 Family account sharing
- 🌙 Dark mode UI
- 🤝 Community features
- 🌐 Telemedicine integration

---

**GlycoGuard** - Empowering patients to take control of their diabetes management with AI-driven insights and personalized support.
