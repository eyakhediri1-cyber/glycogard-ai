import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/layout.css';

const Layout = ({ children, isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

  // For the demo: simulated real-time glucose in Top Bar
  const [topBarGlucose, setTopBarGlucose] = useState(142);
  const [trend, setTrend] = useState('rising');

  useEffect(() => {
    const interval = setInterval(() => {
      setTopBarGlucose(prev => {
        const delta = (Math.random() - 0.48) * 8;
        const next = Math.max(60, Math.min(280, prev + delta));
        setTrend(next - prev > 3 ? 'rising' : next - prev < -3 ? 'falling' : 'stable');
        return Math.round(next);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (!isAuthenticated) {
    return children;
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', short: 'Dash' },
    { path: '/blood-sugar', label: 'Glycémie', icon: '🩸', short: 'Glyco' },
    { path: '/nutrition', label: 'Nutrition', icon: '🍽️', short: 'Nutri' },
    { path: '/medications', label: 'Médicaments', icon: '💊', short: 'Meds', badge: '3' },
    { path: '/mental-health', label: 'Bien-être', icon: '😊', short: 'Zen' },
    { path: '/risk-assessment', label: 'Risques', icon: '⚠️', short: 'Risk' },
    { path: '/ai-companion', label: 'AI Companion', icon: '🤖', short: 'AI' },
  ];

  return (
    <div className={`app-shell ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* TOP BAR */}
      <header className="top-bar">
        <div className="top-bar-left">
          <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </button>
          <div className="app-logo" onClick={() => navigate('/dashboard')}>
            <span className="logo-icon">🩺</span>
            <span className="logo-text">GlycoGuard</span>
          </div>
        </div>

        <div className="top-bar-center">
          <div className={`cgm-badge-live ${topBarGlucose < 70 ? 'critical' : ''}`}>
            <span className="live-dot">●</span>
            <span className="live-text">LIVE</span>
            <span className="live-value">{topBarGlucose}</span>
            <span className="live-unit">mg/dL</span>
            <span className={`live-trend ${trend}`}>
              {trend === 'rising' ? '↗' : trend === 'falling' ? '↘' : '→'}
            </span>
          </div>
        </div>

        <div className="top-bar-right">
          <div className="top-bar-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="notification-bell">
            🔔<span className="notif-badge">2</span>
          </div>
          <div className="user-profile-dropdown">
            <div className="avatar-circle">{user.firstName?.[0] || 'P'}</div>
          </div>
        </div>
      </header>

      <div className="app-body">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="patient-mini-card">
              <div className="avatar-circle small">{user.firstName?.[0] || 'P'}</div>
              <div className="patient-info">
                <div className="patient-name">{user.firstName} {user.lastName}</div>
                <div className="patient-type">Diabète Type {user.diabetesType || '2'}</div>
              </div>
            </div>
            <button className="btn-logout-minimal" onClick={handleLogout}>
              🚪 Déconnexion
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          <div className="content-container">
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="bottom-nav">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.path}
            className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.short}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
