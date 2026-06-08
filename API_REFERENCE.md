# GlycoGuard API Reference

Complete API documentation with examples for all 30+ endpoints.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints except `/auth/register` and `/auth/login` require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication Endpoints

### Register New User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-05-15",
  "gender": "M",
  "diabetesType": "2"
}

Response (201):
{
  "user": {
    "id": 1,
    "uuid": "abc-123-def",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "demo@glycoguard.com",
  "password": "password123"
}

Response (200):
{
  "user": {
    "id": 1,
    "uuid": "abc-123-def",
    "email": "demo@glycoguard.com",
    "firstName": "Ahmed",
    "lastName": "Hassan"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 👤 User Profile Endpoints

### Get User Profile
```
GET /users/profile
Authorization: Bearer <TOKEN>

Response (200):
{
  "id": 1,
  "uuid": "abc-123",
  "email": "demo@glycoguard.com",
  "firstName": "Ahmed",
  "lastName": "Hassan",
  "dateOfBirth": "1980-05-15",
  "gender": "M",
  "weightKg": 85,
  "heightCm": 178,
  "diabetesType": "2",
  "diagnosisYear": 2018,
  "createdAt": "2026-05-06T10:00:00Z"
}
```

### Update User Profile
```
PUT /users/profile
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "firstName": "Ahmed",
  "lastName": "Hassan",
  "weightKg": 82,
  "heightCm": 178,
  "diabetesType": "2",
  "diagnosisYear": 2018
}

Response (200):
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "uuid": "abc-123",
    "email": "demo@glycoguard.com",
    "first_name": "Ahmed",
    "last_name": "Hassan",
    "weight_kg": 82,
    "height_cm": 178
  }
}
```

---

## 🩺 Blood Sugar Endpoints

### Add Blood Sugar Record
```
POST /blood-sugar/add
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "glucoseLevel": 145,
  "measurementTime": "2026-05-06T08:30:00Z",
  "mealType": "Before meal",
  "notes": "Regular morning reading"
}

Response (201):
{
  "message": "Blood sugar record added",
  "record": {
    "id": 1,
    "glucose_level": 145,
    "measurement_time": "2026-05-06T08:30:00Z",
    "meal_type": "Before meal",
    "notes": "Regular morning reading"
  }
}
```

### Get Blood Sugar Records
```
GET /blood-sugar/records?days=30
Authorization: Bearer <TOKEN>

Response (200):
{
  "count": 15,
  "records": [
    {
      "id": 1,
      "glucose_level": 145,
      "measurement_time": "2026-05-06T08:30:00Z",
      "meal_type": "Before meal",
      "notes": "Regular morning reading",
      "created_at": "2026-05-06T08:30:00Z"
    },
    ...
  ]
}
```

### Get Blood Sugar Statistics
```
GET /blood-sugar/stats?days=30
Authorization: Bearer <TOKEN>

Response (200):
{
  "average_glucose": "165.40",
  "min_glucose": 135,
  "max_glucose": 220,
  "total_readings": 15
}
```

---

## 💊 Medication Endpoints

### Add Medication
```
POST /medications/add
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "Metformin",
  "dosage": "500mg",
  "frequency": "Twice daily",
  "startDate": "2024-01-15",
  "endDate": null,
  "sideEffects": "Mild nausea"
}

Response (201):
{
  "message": "Medication added",
  "medication": {
    "id": 1,
    "name": "Metformin",
    "dosage": "500mg",
    "frequency": "Twice daily",
    "start_date": "2024-01-15",
    "end_date": null,
    "side_effects": "Mild nausea"
  }
}
```

### Get All Medications
```
GET /medications/list
Authorization: Bearer <TOKEN>

Response (200):
{
  "count": 3,
  "medications": [
    {
      "id": 1,
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "start_date": "2024-01-15",
      "end_date": null,
      "side_effects": "Mild nausea",
      "created_at": "2026-05-06T10:00:00Z"
    },
    ...
  ]
}
```

### Update Medication
```
PUT /medications/{medicationId}
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "Metformin",
  "dosage": "750mg",
  "frequency": "Three times daily",
  "endDate": null,
  "sideEffects": "Mild nausea"
}

Response (200):
{
  "message": "Medication updated",
  "medication": {
    "id": 1,
    "name": "Metformin",
    "dosage": "750mg",
    "frequency": "Three times daily",
    "start_date": "2024-01-15",
    "end_date": null,
    "side_effects": "Mild nausea"
  }
}
```

### Delete Medication
```
DELETE /medications/{medicationId}
Authorization: Bearer <TOKEN>

Response (200):
{
  "message": "Medication deleted"
}
```

---

## 🍽️ Nutrition Endpoints

### Add Nutrition Log
```
POST /nutrition/add
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "mealName": "Grilled Chicken with Rice",
  "calories": 450,
  "carbsG": 35,
  "proteinG": 40,
  "fatG": 12,
  "logDate": "2026-05-06",
  "mealTime": "Lunch"
}

Response (201):
{
  "message": "Nutrition log added",
  "log": {
    "id": 1,
    "meal_name": "Grilled Chicken with Rice",
    "calories": 450,
    "carbs_g": 35,
    "protein_g": 40,
    "fat_g": 12,
    "log_date": "2026-05-06",
    "meal_time": "Lunch"
  }
}
```

### Get Nutrition Logs
```
GET /nutrition/logs?logDate=2026-05-06
Authorization: Bearer <TOKEN>

Response (200):
{
  "count": 3,
  "logs": [
    {
      "id": 1,
      "meal_name": "Grilled Chicken with Rice",
      "calories": 450,
      "carbs_g": 35,
      "protein_g": 40,
      "fat_g": 12,
      "log_date": "2026-05-06",
      "meal_time": "Lunch"
    },
    ...
  ]
}
```

### Get Nutrition Statistics
```
GET /nutrition/stats?days=30
Authorization: Bearer <TOKEN>

Response (200):
{
  "avg_calories": "412.50",
  "avg_carbs": "38.50",
  "avg_protein": "32.67",
  "avg_fat": "12.33"
}
```

---

## 😊 Mental Health Endpoints

### Add Mental Health Log
```
POST /mental-health/add
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "moodScore": 7,
  "stressLevel": 5,
  "sleepHours": 7.5,
  "anxietyLevel": 3,
  "notes": "Feeling good today",
  "logDate": "2026-05-06"
}

Response (201):
{
  "message": "Mental health log added",
  "log": {
    "id": 1,
    "mood_score": 7,
    "stress_level": 5,
    "sleep_hours": 7.5,
    "anxiety_level": 3,
    "notes": "Feeling good today",
    "log_date": "2026-05-06"
  }
}
```

### Get Mental Health Logs
```
GET /mental-health/logs?days=30
Authorization: Bearer <TOKEN>

Response (200):
{
  "count": 6,
  "logs": [
    {
      "id": 1,
      "mood_score": 7,
      "stress_level": 5,
      "sleep_hours": 7.5,
      "anxiety_level": 3,
      "notes": "Feeling good today",
      "log_date": "2026-05-06",
      "created_at": "2026-05-06T10:00:00Z"
    },
    ...
  ]
}
```

### Get Mental Health Statistics
```
GET /mental-health/stats?days=30
Authorization: Bearer <TOKEN>

Response (200):
{
  "avg_mood": "6.67",
  "avg_stress": "5.83",
  "avg_sleep": "7.08",
  "avg_anxiety": "4.17"
}
```

---

## ⚠️ Risk Assessment Endpoints

### Assess Health Risk
```
POST /risk-assessment/assess
Authorization: Bearer <TOKEN>

Response (201):
{
  "assessment": {
    "id": 1,
    "risk_score": "45.00",
    "risk_level": "Moderate",
    "recommendations": "Continue current medication regimen. Focus on reducing stress and maintaining consistent exercise routine.",
    "assessment_date": "2026-05-06"
  },
  "riskFactors": [
    "Elevated glucose levels",
    "High stress levels"
  ]
}
```

### Get Risk Assessments
```
GET /risk-assessment/assessments
Authorization: Bearer <TOKEN>

Response (200):
{
  "count": 1,
  "assessments": [
    {
      "id": 1,
      "risk_type": "Comprehensive Health",
      "risk_score": "45.00",
      "risk_level": "Moderate",
      "recommendations": "Continue current medication regimen...",
      "assessment_date": "2026-05-06"
    }
  ]
}
```

### Get AI Insights
```
GET /risk-assessment/insights
Authorization: Bearer <TOKEN>

Response (200):
{
  "insights": "Based on your current health data... (personalized AI-generated insights)",
  "riskLevel": "Moderate",
  "riskScore": 45
}
```

---

## 🤖 AI Companion Endpoints

### Send Message
```
POST /ai-companion/message
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "message": "How can I manage my blood sugar better?"
}

Response (200):
{
  "userMessage": "How can I manage my blood sugar better?",
  "aiResponse": "Based on your recent readings and health data, I recommend... (AI-generated response)",
  "timestamp": "2026-05-06T14:30:00Z"
}
```

### Get Chat History
```
GET /ai-companion/history?limit=20
Authorization: Bearer <TOKEN>

Response (200):
{
  "count": 5,
  "messages": [
    {
      "id": 1,
      "message_text": "How can I manage my blood sugar better?",
      "response_text": "Based on your recent readings...",
      "message_type": "User-Chat",
      "created_at": "2026-05-06T14:30:00Z"
    },
    ...
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting (Recommended for Production)

Add to express app:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Testing with cURL Examples

### Quick Test Flow

```bash
# 1. Login with demo account
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@glycoguard.com","password":"password123"}' \
  | jq -r '.token')

# 2. Get profile
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/users/profile | jq

# 3. Add blood sugar reading
curl -X POST http://localhost:5000/api/blood-sugar/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"glucoseLevel":155,"measurementTime":"2026-05-06T08:30:00Z","mealType":"Before meal"}' | jq

# 4. Get blood sugar records
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/blood-sugar/records | jq

# 5. Chat with AI
curl -X POST http://localhost:5000/api/ai-companion/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"How are my blood sugar levels?"}' | jq
```

---

## WebSocket Support (Recommended Future Enhancement)

For real-time updates:
```javascript
io.on('connection', (socket) => {
  socket.on('blood-sugar-update', (data) => {
    io.emit('user-data-changed', data);
  });
});
```

---

## Pagination (When Needed)

Extend endpoints with pagination:
```
GET /api/blood-sugar/records?days=30&page=1&limit=10
```

Response includes:
```json
{
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "records": [...]
}
```

---

**Last Updated**: 2026-05-06
**API Version**: 1.0
**Status**: Production Ready ✅
