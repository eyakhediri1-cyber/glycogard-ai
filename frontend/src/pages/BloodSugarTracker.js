import React, { useEffect, useState } from 'react';
import { bloodSugarAPI } from '../services/api';
import MedCard from '../components/MedCard';
import GlucoseBadge from '../components/GlucoseBadge';
import toast from 'react-hot-toast';
import '../styles/blood-sugar.css';

const BloodSugarTracker = () => {
  const [records, setRecords] = useState([]);
  const [glucoseLevel, setGlucoseLevel] = useState('');
  const [mealType, setMealType] = useState('À jeun');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await bloodSugarAPI.getRecords();
      setRecords(response.data.records);
    } catch (error) {
      toast.error('Échec du chargement des mesures');
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();

    if (!glucoseLevel || glucoseLevel < 20 || glucoseLevel > 600) {
      toast.error('Veuillez entrer une valeur valide (20-600 mg/dL)');
      return;
    }

    try {
      setLoading(true);
      await bloodSugarAPI.addRecord({
        glucoseLevel: parseInt(glucoseLevel),
        measurementTime: new Date().toISOString(),
        mealType,
        notes,
      });

      toast.success('Mesure enregistrée !');
      setGlucoseLevel('');
      setNotes('');
      fetchRecords();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blood-sugar-v2 animate-fade-in">
      <div className="bs-header">
        <h1>Journal de Glycémie</h1>
        <p>Enregistrez vos mesures manuelles et surveillez vos tendances métaboliques.</p>
      </div>

      <div className="bs-grid">
        <div className="bs-left">
          <MedCard title="Nouvelle Mesure" icon="🩸" className="form-card">
            <form onSubmit={handleAddRecord} className="bs-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Glycémie (mg/dL)</label>
                  <input
                    type="number"
                    value={glucoseLevel}
                    onChange={(e) => setGlucoseLevel(e.target.value)}
                    placeholder="Ex: 115"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Moment de la mesure</label>
                  <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                    <option>À jeun</option>
                    <option>Avant repas</option>
                    <option>Après repas (2h)</option>
                    <option>Avant le coucher</option>
                    <option>Aléatoire</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Notes & Contexte</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Après exercice, stress important, repas riche..."
                />
              </div>
              <button type="submit" className="btn-add-bs" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer la mesure'}
              </button>
            </form>
          </MedCard>
        </div>

        <div className="bs-right">
          <MedCard title="Historique des Lectures" icon="📜" className="history-card">
            <div className="bs-history-list">
              {records.length === 0 ? (
                <p className="no-data">Aucune mesure enregistrée pour le moment.</p>
              ) : (
                records.map((record) => (
                  <div key={record.id} className="bs-item">
                    <div className="bs-item-main">
                      <GlucoseBadge value={record.glucose_level} />
                      <div className="bs-item-info">
                        <strong>{record.meal_type}</strong>
                        <span>{new Date(record.measurement_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </div>
                    {record.notes && (
                      <div className="bs-item-notes">
                        <span className="quote">“</span>
                        {record.notes}
                      </div>
                    )}
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

export default BloodSugarTracker;
