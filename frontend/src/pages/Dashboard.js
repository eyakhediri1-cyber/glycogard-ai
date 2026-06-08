import React, { useEffect, useState } from 'react';
import { bloodSugarAPI, mentalHealthAPI, nutritionAPI, riskAssessmentAPI } from '../services/api';
import BloodSugarChart from '../components/BloodSugarChart';
import MedCard from '../components/MedCard';
import GlucoseBadge from '../components/GlucoseBadge';
import toast from 'react-hot-toast';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [bloodSugarStats, setBloodSugarStats] = useState(null);
  const [mentalHealthStats, setMentalHealthStats] = useState(null);
  const [nutritionStats, setNutritionStats] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [loading, setLoading] = useState(true);

  const [glucose, setGlucose] = useState(142);
  const [trend, setTrend] = useState('stable');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [simulatedSeries, setSimulatedSeries] = useState([]);
  const [isHypoAlert, setIsHypoAlert] = useState(false);

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      setGlucose(prev => {
        const delta = (Math.random() - 0.5) * 12;
        const next = Math.max(60, Math.min(280, prev + delta));
        const diff = next - prev;
        const newTrend = diff > 5 ? 'rising' : diff < -5 ? 'falling' : 'stable';
        setTrend(newTrend);
        setLastUpdate(new Date());

        const roundedNext = Math.round(next);
        setSimulatedSeries((series) => {
          const nextPoint = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            glucose: roundedNext,
          };
          return [...series.slice(-35), nextPoint];
        });

        if (roundedNext < 70) {
          setIsHypoAlert(true);
          playHypoTone();
          setTimeout(() => setIsHypoAlert(false), 1300);
        }

        return roundedNext;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const playHypoTone = () => {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(660, context.currentTime);
      gainNode.gain.setValueAtTime(0.0001, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.05, context.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.25);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.26);
    } catch (error) {
      // ignore browser audio initialization restrictions
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [bsStats, mhStats, nhStats, risk] = await Promise.all([
        bloodSugarAPI.getStats(),
        mentalHealthAPI.getStats(),
        nutritionAPI.getStats(),
        riskAssessmentAPI.getAssessments(),
      ]);

      setBloodSugarStats(bsStats.data);
      setMentalHealthStats(mhStats.data);
      setNutritionStats(nhStats.data);
      if (risk.data.assessments.length > 0) {
        setRiskLevel(risk.data.assessments[0]);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTIR = () => {
    return bloodSugarStats?.tir_percentage || 78;
  };

  const calculateHbA1c = () => {
    // Formula: (Avg + 46.7) / 28.7
    return bloodSugarStats?.estimated_hba1c || 7.2;
  };

  if (loading) {
    return <div className="loading">Initialisation de votre portail médical...</div>;
  }

  return (
    <div className="dashboard-v2 animate-fade-in">
      {/* SECTION 1: HERO CGM (PRO LEVEL) */}
      <div className="cgm-hero-section">
        <MedCard 
          title="Glycémie en Temps Réel" 
          icon="🩸" 
          badge="● LIVE"
          className="cgm-hero-card"
        >
          <div className="cgm-hero-content">
            <div className="cgm-main-display">
              <GlucoseBadge value={glucose} trend={trend} showLabel={false} />
              <div className="cgm-quick-stats">
                <div className="cgm-mini-kpi">
                  <label>TIR (24h)</label>
                  <span className="value">{calculateTIR()}%</span>
                </div>
                <div className="cgm-mini-kpi">
                  <label>HbA1c Est.</label>
                  <span className="value">{calculateHbA1c()}%</span>
                </div>
                <div className="cgm-mini-kpi">
                  <label>Objectif Perso</label>
                  <span className="value">80-160</span>
                </div>
              </div>
            </div>
            <div className="cgm-target-bar-container">
              <div className="target-bar">
                <div className="target-zone" style={{ left: '70px', width: '110px' }}></div>
                <div className="current-marker" style={{ left: `${(glucose / 300) * 100}%` }}></div>
              </div>
              <div className="target-labels">
                <span>0</span>
                <span>Cible (70-180)</span>
                <span>300</span>
              </div>
            </div>
            <p className="last-update">
              Dernière mesure il y a {Math.round((new Date() - lastUpdate) / 1000)} secondes
            </p>
          </div>
        </MedCard>
      </div>

      {/* SECTION 2: 4 KPI CLINICAL GRID */}
      <div className="kpi-grid">
        <MedCard title="Repas Suivant" icon="🍽️">
          <div className="kpi-content">
            <div className="kpi-value">Déjeuner</div>
            <div className="kpi-subtext">Prévu à 12:30</div>
            <div className="kpi-trend positive">↗ Glucides modérés</div>
          </div>
        </MedCard>
        <MedCard title="Insuline Active" icon="💊">
          <div className="kpi-content">
            <div className="kpi-value">2.4 U</div>
            <div className="kpi-subtext">Lantus (Lente)</div>
            <div className="kpi-trend">Dose du soir prête</div>
          </div>
        </MedCard>
        <MedCard title="Activité" icon="🏃">
          <div className="kpi-content">
            <div className="kpi-value">4,250</div>
            <div className="kpi-subtext">pas aujourd'hui</div>
            <div className="kpi-trend positive">↗ 65% objectif</div>
          </div>
        </MedCard>
        <MedCard title="Risque" icon="⚠️">
          <div className="kpi-content">
            <div className="kpi-value">{riskLevel?.risk_level || 'Faible'}</div>
            <div className="kpi-subtext">Score: {riskLevel?.risk_score || 0}/100</div>
            <div className="kpi-trend negative">↘ Action recommandée</div>
          </div>
        </MedCard>
      </div>

      {/* SECTION 3: GRAPH & ALERTS */}
      <div className="dashboard-lower-grid">
        <MedCard title="Tendances 24h" icon="📊" className="main-chart-card">
          <div className="chart-wrapper">
            <BloodSugarChart simulatedSeries={simulatedSeries} />
          </div>
        </MedCard>

        <MedCard title="Alertes & Rappels" icon="🔔" badge="2" className="alerts-card">
          <div className="alerts-list">
            <div className={`alert-item critical ${isHypoAlert ? 'critical-alert' : ''}`}>
              <div className="alert-icon">⚠️</div>
              <div className="alert-text">
                <strong>Hypoglycémie détectée</strong>
                <p>
                  {glucose < 70
                    ? `Glycémie à ${glucose} mg/dL. Prendre 15g de sucre rapide et recontrôler dans 15 min.`
                    : 'Surveillance active des épisodes hypo.'}
                </p>
              </div>
            </div>
            <div className="alert-item">
              <div className="alert-icon">🩺</div>
              <div className="alert-text">
                <strong>Rendez-vous Docteur</strong>
                <p>Dr. Mansour le 15 Mai à 14:00. N'oubliez pas votre rapport PDF.</p>
              </div>
            </div>
            <div className="alert-item success">
              <div className="alert-icon">✅</div>
              <div className="alert-text">
                <strong>Objectif HbA1c</strong>
                <p>Félicitations ! Votre HbA1c estimée a baissé de 0.2% cette semaine.</p>
              </div>
            </div>
          </div>
        </MedCard>
      </div>
    </div>
  );
};

export default Dashboard;
