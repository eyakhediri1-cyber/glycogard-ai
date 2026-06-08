import React, { useEffect, useState } from 'react';
import { mentalHealthAPI } from '../services/api';
import MedCard from '../components/MedCard';
import toast from 'react-hot-toast';
import '../styles/mental-health.css';

const MentalHealthLogger = () => {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    moodScore: 7,
    stressLevel: 3,
    sleepHours: 7.5,
    anxietyLevel: 2,
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await mentalHealthAPI.getLogs();
      setLogs(response.data.logs);
    } catch (error) {
      toast.error('Échec du chargement de l\'historique');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'notes' ? value : parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await mentalHealthAPI.addLog({
        ...formData,
        logDate: new Date().toISOString().split('T')[0],
      });

      toast.success('Check-in bien-être enregistré ! ✨');
      setFormData({
        moodScore: 7,
        stressLevel: 3,
        sleepHours: 7.5,
        anxietyLevel: 2,
        notes: '',
      });
      fetchLogs();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (score) => {
    if (score <= 2) return '😔';
    if (score <= 4) return '😕';
    if (score <= 6) return '😐';
    if (score <= 8) return '😊';
    return '✨';
  };

  return (
    <div className="wellness-v2 animate-fade-in">
      <div className="wellness-header">
        <h1>Bien-être & Équilibre</h1>
        <p>Le stress et le sommeil impactent directement votre glycémie. Suivez-les pour mieux comprendre votre corps.</p>
      </div>

      <div className="wellness-grid">
        <div className="wellness-left">
          <MedCard title="Check-in Quotidien" icon="🧘" className="form-card">
            <form onSubmit={handleSubmit} className="wellness-form">
              <div className="form-group-range">
                <div className="range-header">
                  <label>Humeur Générale {getMoodEmoji(formData.moodScore)}</label>
                  <span className="range-val">{formData.moodScore}/10</span>
                </div>
                <input
                  type="range"
                  name="moodScore"
                  min="1"
                  max="10"
                  step="1"
                  value={formData.moodScore}
                  onChange={handleInputChange}
                  className="med-range"
                />
              </div>

              <div className="form-group-range">
                <div className="range-header">
                  <label>Niveau de Stress 🔋</label>
                  <span className="range-val">{formData.stressLevel}/10</span>
                </div>
                <input
                  type="range"
                  name="stressLevel"
                  min="1"
                  max="10"
                  value={formData.stressLevel}
                  onChange={handleInputChange}
                  className="med-range stress"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sommeil (heures) 🌙</label>
                  <input
                    type="number"
                    name="sleepHours"
                    min="0"
                    max="15"
                    step="0.5"
                    value={formData.sleepHours}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Anxiété 😟</label>
                  <input
                    type="range"
                    name="anxietyLevel"
                    min="1"
                    max="10"
                    value={formData.anxietyLevel}
                    onChange={handleInputChange}
                    className="med-range"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Réflexions du jour</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Notes libres sur votre état de santé ou émotionnel..."
                />
              </div>

              <button type="submit" className="btn-save-wellness" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer mon état'}
              </button>
            </form>
          </MedCard>
        </div>

        <div className="wellness-right">
          <MedCard title="Historique Bien-être" icon="🕒" className="history-card">
            <div className="wellness-logs">
              {logs.length === 0 ? (
                <div className="no-data-zen">
                  <p>Aucun check-in enregistré.</p>
                  <span>Prendre un moment pour soi est essentiel.</span>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="wellness-log-item">
                    <div className="log-date-badge">
                      {new Date(log.log_date).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                    </div>
                    <div className="log-stats-grid">
                      <div className="mini-stat">
                        <span className="icon">{getMoodEmoji(log.mood_score)}</span>
                        <span className="label">Humeur</span>
                        <span className="val">{log.mood_score}/10</span>
                      </div>
                      <div className="mini-stat">
                        <span className="icon">💤</span>
                        <span className="label">Sommeil</span>
                        <span className="val">{log.sleep_hours}h</span>
                      </div>
                      <div className="mini-stat">
                        <span className="icon">🔥</span>
                        <span className="label">Stress</span>
                        <span className="val">{log.stress_level}/10</span>
                      </div>
                    </div>
                    {log.notes && <div className="log-notes-bubble">"{log.notes}"</div>}
                  </div>
                ))
              )}
            </div>
          </MedCard>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthLogger;
