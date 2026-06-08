import React, { useEffect, useState } from 'react';
import { medicationAPI } from '../services/api';
import MedCard from '../components/MedCard';
import toast from 'react-hot-toast';
import '../styles/medications.css';

const Medications = () => {
  const [meds, setMeds] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '1x par jour',
    is_insulin: false,
    renewal_date: '',
  });

  useEffect(() => {
    fetchMeds();
  }, []);

  const fetchMeds = async () => {
    try {
      const response = await medicationAPI.getMedications();
      setMeds(response.data.medications);
    } catch (error) {
      toast.error('Erreur de chargement des médicaments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await medicationAPI.addMedication(formData);
      toast.success('Médicament ajouté !');
      setFormData({ name: '', dosage: '', frequency: '1x par jour', is_insulin: false, renewal_date: '' });
      fetchMeds();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  return (
    <div className="meds-v2 animate-fade-in">
      <div className="meds-header">
        <h1>Gestion des Traitements</h1>
        <p>Suivez vos médicaments et l'observance de votre traitement insulinique.</p>
      </div>

      <div className="meds-grid">
        <div className="meds-left">
          <MedCard title="Ajouter un Traitement" icon="💊">
            <form onSubmit={handleSubmit} className="meds-form">
              <div className="form-group">
                <label>Nom du médicament</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Metformine, Lantus..."
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Dosage</label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    placeholder="Ex: 500mg, 10 Unités"
                  />
                </div>
                <div className="form-group">
                  <label>Fréquence</label>
                  <select value={formData.frequency} onChange={(e) => setFormData({...formData, frequency: e.target.value})}>
                    <option>1x par jour</option>
                    <option>2x par jour</option>
                    <option>3x par jour</option>
                    <option>Avant chaque repas</option>
                    <option>Le soir au coucher</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="is_insulin"
                    checked={formData.is_insulin}
                    onChange={(e) => setFormData({...formData, is_insulin: e.target.checked})}
                  />
                  <label htmlFor="is_insulin">C'est une insuline</label>
                </div>
                <div className="form-group">
                  <label>Date de renouvellement</label>
                  <input
                    type="date"
                    value={formData.renewal_date}
                    onChange={(e) => setFormData({...formData, renewal_date: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="btn-add-med">Enregistrer le Traitement</button>
            </form>
          </MedCard>
        </div>

        <div className="meds-right">
          <MedCard title="Traitements Actuels" icon="📋">
            <div className="meds-list">
              {meds.length === 0 ? (
                <p className="no-data">Aucun traitement enregistré.</p>
              ) : (
                meds.map(med => (
                  <div key={med.id} className={`med-item ${med.is_insulin ? 'insulin' : ''}`}>
                    <div className="med-info">
                      <h3>{med.name}</h3>
                      <span className="dosage">{med.dosage} — {med.frequency}</span>
                    </div>
                    {med.is_insulin && <span className="insulin-badge">Insuline</span>}
                    {med.renewal_date && (
                      <div className="renewal-info">
                        🗓️ Renouvellement : {new Date(med.renewal_date).toLocaleDateString()}
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

export default Medications;
