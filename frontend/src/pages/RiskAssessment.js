import React, { useEffect, useState } from 'react';
import { riskAssessmentAPI, bloodSugarAPI, medicationAPI } from '../services/api';
import MedCard from '../components/MedCard';
import { generateMedicalReport } from '../utils/reportGenerator';
import toast from 'react-hot-toast';
import '../styles/risk-assessment.css';

const RiskAssessment = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchAssessment();
  }, []);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const [resAssessment, resInsights] = await Promise.all([
        riskAssessmentAPI.assess(),
        riskAssessmentAPI.getInsights()
      ]);
      setData(resAssessment.data);
      setInsights(resInsights.data.insights);
    } catch (error) {
      toast.error('Erreur lors de l\'analyse des risques');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      toast.loading('Génération du rapport PDF...', { id: 'report' });
      
      const [resStats, resMeds] = await Promise.all([
        bloodSugarAPI.getStats(),
        medicationAPI.getMedications()
      ]);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      generateMedicalReport({
        user,
        stats: resStats.data,
        risks: data,
        meds: resMeds.data.medications,
        insights
      });

      toast.success('Rapport prêt !', { id: 'report' });
    } catch (error) {
      toast.error('Échec de la génération du rapport', { id: 'report' });
    } finally {
      setIsGenerating(false);
    }
  };

  const getRiskColor = (score) => {
    if (score < 30) return '#16A34A';
    if (score < 60) return '#D97706';
    return '#DC2626';
  };

  if (loading) {
    return <div className="loading-screen">Analyse clinique de vos données en cours...</div>;
  }

  const assessment = data?.assessment;
  const breakdown = data?.breakdown;

  return (
    <div className="risk-v2 animate-fade-in">
      <div className="risk-header">
        <h1>Évaluation des Risques Cliniques</h1>
        <p>Analyse prédictive des complications liées au diabète basée sur vos données de santé.</p>
      </div>

      <div className="risk-grid">
        {/* GLOBAL SCORE */}
        <div className="risk-left">
          <MedCard title="Score de Risque Global" icon="🛡️" className="global-score-card">
            <div className="global-score-display">
              <div className="score-ring" style={{ borderColor: getRiskColor(assessment?.risk_score) }}>
                <span className="score-val">{assessment?.risk_score || 0}</span>
                <span className="score-label">/100</span>
              </div>
              <div className="score-text">
                <h3>Niveau de Risque : {assessment?.risk_level}</h3>
                <p>Basé sur votre HbA1c, TIR, et antécédents médicaux.</p>
              </div>
            </div>
          </MedCard>

          <MedCard title="Analyse Détaillée" icon="🔍" className="breakdown-card">
            <div className="risk-bars">
              <div className="risk-bar-item">
                <div className="bar-header">
                  <span>Risque Rénal (Néphropathie)</span>
                  <strong>{breakdown?.renal}%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${breakdown?.renal}%`, backgroundColor: getRiskColor(breakdown?.renal) }}></div>
                </div>
              </div>
              
              <div className="risk-bar-item">
                <div className="bar-header">
                  <span>Risque Rétinien (Rétinopathie)</span>
                  <strong>{breakdown?.retinal}%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${breakdown?.retinal}%`, backgroundColor: getRiskColor(breakdown?.retinal) }}></div>
                </div>
              </div>

              <div className="risk-bar-item">
                <div className="bar-header">
                  <span>Risque Pied Diabétique</span>
                  <strong>{breakdown?.foot}%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${breakdown?.foot}%`, backgroundColor: getRiskColor(breakdown?.foot) }}></div>
                </div>
              </div>
            </div>
          </MedCard>
        </div>

        {/* AI INSIGHTS */}
        <div className="risk-right">
          <MedCard title="Conseils de GlycoAI" icon="🤖" className="insights-card">
            <div className="ai-insights-content">
              {insights ? (
                <div className="insights-text">
                  {insights.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
              ) : (
                <p>Analyse en cours...</p>
              )}
            </div>
            <div className="insight-actions">
              <button 
                className="btn-pdf-report" 
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? 'Génération...' : '📄 Générer Rapport PDF'}
              </button>
            </div>
          </MedCard>

          <MedCard title="Facteurs de Vigilance" icon="📋" className="factors-card">
            <ul className="factors-list">
              {data?.riskFactors?.map((f, i) => (
                <li key={i} className="factor-item">
                  <span className="factor-bullet">!</span>
                  {f}
                </li>
              ))}
              {(!data?.riskFactors || data.riskFactors.length === 0) && (
                <li className="factor-item success">
                  <span className="factor-bullet">✓</span>
                  Tous les voyants sont au vert.
                </li>
              )}
            </ul>
          </MedCard>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
