# GlycoGuard Frontend

React-based web application for the GlycoGuard diabetes management platform.

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Features

- ✨ Responsive, modern UI
- 📊 Real-time data visualization
- 🔐 Secure JWT authentication
- 🎨 Beautiful gradient-based design
- 📱 Mobile-friendly interface
- ♿ Accessible components

## Architecture

```
src/
├── pages/          # Full-screen components
├── components/     # Reusable UI components
├── services/       # API client & utilities
├── styles/         # CSS stylesheets
├── App.js          # Main app component
└── index.js        # React entry point
```

## Available Scripts

- `npm start` - Run dev server on http://localhost:3000
- `npm build` - Create optimized production build
- `npm eject` - Eject from React Scripts (irreversible)

## Environment Variables

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Pages

- **Login** - User authentication
- **Dashboard** - Health overview & quick stats
- **Blood Sugar** - Glucose tracking & trends
- **Nutrition** - Meal logging & nutrition tracking
- **Mental Health** - Mood, stress, sleep tracking
- **Risk Assessment** - Health risk evaluation
- **AI Companion** - Conversational health assistant

## Styling

- Global styles: `src/styles/global.css`
- Page-specific styles: `src/styles/*.css`
- Color scheme: Purple gradient (#667eea → #764ba2)
- Responsive breakpoint: 768px

## Dependencies

- React 18 - UI framework
- React Router v6 - Navigation
- Axios - HTTP client
- Chart.js - Data visualization
- React Hot Toast - Notifications
- React Icons - Icon library

## Build & Deploy

```bash
# Production build
npm run build

# Docker build
docker build -t glycoguard-frontend .

# Run via Docker
docker run -p 3000:3000 glycoguard-frontend
```

## Troubleshooting

- **API errors**: Check `REACT_APP_API_URL` environment variable
- **Port in use**: `npm start` on different port: `PORT=3001 npm start`
- **Module not found**: Run `npm install` again
