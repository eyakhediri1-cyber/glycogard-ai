# GlycoGuard - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             React Frontend (Port 3000)               │   │
│  │  - Dashboard, Tracking, Analytics, AI Chat           │   │
│  │  - Responsive UI, Real-time Updates                  │   │
│  │  - Local State Management (React Hooks)              │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST API
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                    API LAYER (Express.js)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Node.js Server (Port 5000)                   │   │
│  │  - Express.js Framework                              │   │
│  │  - JWT Authentication Middleware                     │   │
│  │  - 30+ REST API Endpoints                            │   │
│  │  - Error Handling & CORS                             │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
┌───────────▼─────────┐  ┌──────▼──────────────┐
│  DATABASE LAYER     │  │  AI SERVICES       │
│  ┌───────────────┐  │  ├─────────────────┐  │
│  │ PostgreSQL    │  │  │ OpenAI API      │  │
│  │               │  │  │ (GPT-3.5-turbo) │  │
│  │ 8 Tables:     │  │  │                 │  │
│  │ - users       │  │  │ - Chat AI       │  │
│  │ - blood_sugar │  │  │ - Insights Gen. │  │
│  │ - medications │  │  │ - Risk Analysis │  │
│  │ - nutrition   │  │  └─────────────────┘  │
│  │ - mental_hlth │  │                        │
│  │ - health_mtrc │  │                        │
│  │ - chat_hist   │  │                        │
│  │ - risk_assess │  │                        │
│  └───────────────┘  │                        │
└─────────────────────┴────────────────────────┘
```

## 📦 Component Architecture

### Backend Services

```
Controllers (Business Logic)
├── authController         - User registration & login
├── userController         - User profile management
├── bloodSugarController   - Glucose tracking
├── medicationController   - Medication management
├── nutritionController    - Meal & nutrition logs
├── mentalHealthController - Wellness tracking
├── aiCompanionController  - AI chat interface
└── riskAssessmentController - Health risk evaluation
                            ├── Risk calculation algorithm
                            ├── OpenAI integration
                            └── Recommendation generation

Routes (API Endpoints)
├── /api/auth              - 2 endpoints
├── /api/users             - 2 endpoints
├── /api/blood-sugar       - 3 endpoints
├── /api/medications       - 4 endpoints
├── /api/nutrition         - 3 endpoints
├── /api/mental-health     - 3 endpoints
├── /api/ai-companion      - 2 endpoints
└── /api/risk-assessment   - 3 endpoints

Middleware
├── auth.js               - JWT authentication
├── express middleware    - Error handling, logging
└── Helmet.js            - Security headers

Database
├── Connection pooling    - PostgreSQL
├── Schema definitions   - 8 tables
└── Indexes             - Performance optimization
```

### Frontend Components

```
App.js (Main)
├── Layout
│   ├── Navbar        - Navigation menu
│   └── Footer        - Footer content
│
├── Pages
│   ├── Login         - Authentication
│   ├── Dashboard     - Home/overview
│   ├── BloodSugarTracker
│   ├── NutritionTracker
│   ├── MentalHealthLogger
│   ├── RiskAssessment
│   └── AICompanion
│
├── Components
│   ├── BloodSugarChart - Data visualization
│   ├── RiskBadge       - Status indicator
│   └── Layout          - App wrapper
│
├── Services
│   └── api.js         - Axios HTTP client
│       ├── authAPI
│       ├── userAPI
│       ├── bloodSugarAPI
│       ├── medicationAPI
│       ├── nutritionAPI
│       ├── mentalHealthAPI
│       ├── riskAssessmentAPI
│       └── aiCompanionAPI
│
└── Styles
    ├── global.css
    ├── auth.css
    ├── dashboard.css
    ├── blood-sugar.css
    ├── nutrition.css
    ├── mental-health.css
    ├── risk-assessment.css
    ├── ai-companion.css
    └── layout.css
```

## 🔄 Data Flow Diagram

### User Authentication Flow
```
User Input (Email/Password)
    ↓
Frontend (React)
    ↓ POST /auth/login
Backend (Express)
    ↓
Database Query
    ↓
Password Verification (bcrypt)
    ↓
JWT Token Generation
    ↓
Response with Token
    ↓
Frontend Storage (localStorage)
    ↓
Future Requests (Authorization Header)
    ↓
Middleware Verification
    ↓
Request Processing
```

### Blood Sugar Logging Flow
```
User Entry (Glucose Value)
    ↓
Frontend Validation
    ↓
API Call with Auth Token
    ↓
Backend Authentication Middleware
    ↓
Validation & Processing
    ↓
Database Insert
    ↓
Return Record
    ↓
Frontend State Update
    ↓
UI Refresh with New Data
```

### Health Risk Assessment Flow
```
User Clicks "Assess Risk"
    ↓
Backend Queries Last 30 Days Data:
  ├── Blood Sugar Readings
  ├── Mental Health Logs
  ├── Nutrition Data
  └── Health Metrics
    ↓
Risk Algorithm Calculation:
  ├── Glucose Score (0-30)
  ├── Mental Health Score (0-35)
  ├── Cardiovascular Score (0-35)
  └── Total (0-100)
    ↓
Risk Level Assignment:
  ├── 0-30: Low
  ├── 30-50: Moderate
  ├── 50-70: High
  └── 70-100: Critical
    ↓
AI Recommendation Generation (OpenAI)
    ↓
Database Storage
    ↓
Response to Frontend with:
  ├── Risk Score
  ├── Risk Level
  ├── Risk Factors
  └── Personalized Recommendations
    ↓
Frontend Display
```

### AI Chat Flow
```
User Message
    ↓
Frontend Sends to Backend
    ↓
Backend Retrieves User Context:
  ├── Recent Blood Sugar
  ├── Medications
  └── Health Profile
    ↓
OpenAI API Call with Context
    ├── System Prompt (AI Personality)
    ├── User Context
    └── User Message
    ↓
OpenAI Generates Response
    ↓
Response Saved to Chat History
    ↓
Response Returned to Frontend
    ↓
Display in Chat UI
    ↓
Chat History Preserved
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(10),
  weight_kg DECIMAL(5,2),
  height_cm INTEGER,
  diabetes_type VARCHAR(20),
  diagnosis_year INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Blood Sugar Records Table
```sql
CREATE TABLE blood_sugar_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  glucose_level INTEGER,
  measurement_time TIMESTAMP,
  meal_type VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP
);
-- INDEX on user_id, measurement_time for performance
```

### Similar tables for:
- medications
- nutrition_logs
- health_metrics
- mental_health_logs
- chat_history
- risk_assessments

## 🔐 Security Architecture

### Authentication & Authorization
```
User Login
    ↓
Email + Password
    ↓
Database Lookup & bcrypt Comparison
    ↓
JWT Token Generated (7 day expiry)
    ↓
Token in Authorization Header
    ↓
Middleware Verifies Token
    ↓
If Valid: Continue Processing
Otherwise: 403 Forbidden
```

### Password Security
- Bcrypt hashing with salt rounds (10)
- Never stored in plain text
- Salted comparison

### API Security
- Helmet.js security headers
- CORS enabled for frontend
- Input validation
- Rate limiting (recommended)
- HTTPS in production

## 📊 Performance Optimizations

### Database
- Indexed queries (user_id, timestamps)
- Connection pooling
- Query optimization

### Frontend
- React memoization
- Code splitting
- Lazy loading
- CSS minification

### API
- Response caching
- Pagination support
- Efficient JSON payloads

## 🚀 Deployment Architecture

### Docker Compose Setup
```yaml
Services:
├── PostgreSQL (Port 5432)
│   └── Data Volume for persistence
├── Backend (Port 5000)
│   ├── Depends on: Database
│   └── Auto-restart on failure
└── Frontend (Port 3000)
    └── Depends on: Backend
```

### Environment Management
```
Development: .env (local)
Docker: environment: in docker-compose.yml
Production: Use Docker secrets or Kubernetes
```

## 📈 Scalability Considerations

### Current Architecture (Single Server)
- Suitable for: < 10,000 users
- Response time: < 200ms
- Uptime SLA: 99%

### For 100,000+ Users:
```
Load Balancer (Nginx)
    ├── Backend Instance 1
    ├── Backend Instance 2
    └── Backend Instance N

Database Replication
    ├── Primary (write)
    ├── Replica 1 (read)
    └── Replica N (read)

Cache Layer (Redis)
    └── Session & frequent query caching

CDN
    └── Static asset delivery
```

## 🔄 API Version Management

```
Current: v1 (2026)
├── /api/auth
├── /api/users
├── /api/blood-sugar
└── ... (all endpoints)

Future: v2 (with breaking changes)
├── /api/v2/auth
└── ... (improved endpoints)

Backward Compatibility
└── Support both v1 and v2
```

## 📊 Monitoring & Logging

### Recommended Tools
- **Logs**: Winston or Morgan (already integrated)
- **Monitoring**: Prometheus, Grafana
- **Error Tracking**: Sentry
- **APM**: New Relic or Datadog

## 🎯 Testing Strategy

### Backend Testing
```
Unit Tests: Jest
├── Controllers
├── Middleware
└── Utilities

Integration Tests
├── API Endpoints
├── Database Operations
└── Authentication

Load Testing: k6 or Apache Bench
```

### Frontend Testing
```
Unit Tests: React Testing Library
├── Components
└── Services

E2E Tests: Cypress
├── Complete user flows
├── Authentication
└── Data operations
```

---

**This architecture ensures:**
- ✅ Scalability
- ✅ Security
- ✅ Maintainability
- ✅ Performance
- ✅ Reliability
