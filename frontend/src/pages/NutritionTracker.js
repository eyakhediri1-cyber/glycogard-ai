import React, { useEffect, useState } from 'react';
import { nutritionAPI } from '../services/api';
import MedCard from '../components/MedCard';
import toast from 'react-hot-toast';
import '../styles/nutrition.css';

const NutritionTracker = () => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    mealName: '',
    calories: '',
    carbsG: '',
    proteinG: '',
    fatG: '',
    mealTime: 'Déjeuner',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await nutritionAPI.getLogs(new Date().toISOString().split('T')[0]);
      setLogs(response.data.logs);
    } catch (error) {
      toast.error('Échec du chargement des logs nutritionnels');
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await nutritionAPI.searchFood(query);
      setSearchResults(response.data.products?.slice(0, 5) || []);
    } catch (error) {
      console.error('Food search failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectProduct = (product) => {
    setFormData({
      mealName: product.product_name,
      calories: Math.round(product.nutriments?.['energy-kcal_100g'] || 0),
      carbsG: product.nutriments?.carbohydrates_100g || 0,
      proteinG: product.nutriments?.proteins_100g || 0,
      fatG: product.nutriments?.fat_100g || 0,
      mealTime: formData.mealTime,
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const isAuto = !formData.calories && !formData.carbsG;
      
      if (isAuto) {
        toast.loading('GlycoAI analyse votre repas...', { id: 'nutrition-ai' });
      }

      await nutritionAPI.addLog({
        ...formData,
        calories: parseInt(formData.calories) || 0,
        carbsG: parseFloat(formData.carbsG) || 0,
        proteinG: parseFloat(formData.proteinG) || 0,
        fatG: parseFloat(formData.fatG) || 0,
        logDate: new Date().toISOString().split('T')[0],
        autoEstimate: isAuto
      });

      toast.success(isAuto ? 'Estimation AI réussie !' : 'Repas enregistré', { id: 'nutrition-ai' });
      
      setFormData({
        mealName: '',
        calories: '',
        carbsG: '',
        proteinG: '',
        fatG: '',
        mealTime: 'Déjeuner',
      });
      fetchLogs();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement', { id: 'nutrition-ai' });
    } finally {
      setLoading(false);
    }
  };

  const totals = logs.reduce((acc, log) => ({
    cal: acc.cal + (log.calories || 0),
    carbs: acc.carbs + parseFloat(log.carbs_g || 0),
    prot: acc.prot + parseFloat(log.protein_g || 0),
    fat: acc.fat + parseFloat(log.fat_g || 0),
  }), { cal: 0, carbs: 0, prot: 0, fat: 0 });

  return (
    <div className="nutrition-v2 animate-fade-in">
      <div className="nutrition-header">
        <h1>Nutrition & Coaching AI</h1>
        <p>Suivez vos repas et analysez leur impact glycémique en temps réel.</p>
      </div>

      <div className="nutrition-grid">
        <div className="nutrition-left">
          <MedCard title="Ajouter un Repas" icon="🥗" className="form-card">
            <div className="search-container">
              <input
                type="text"
                className="food-search-input"
                placeholder="Rechercher un produit (Open Food Facts)..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {isSearching && <div className="search-loader">⌛ Recherche...</div>}
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map(p => (
                    <div key={p._id} className="search-item" onClick={() => selectProduct(p)}>
                      <img src={p.image_thumb_url || 'https://via.placeholder.com/40'} alt="" />
                      <div className="search-item-info">
                        <strong>{p.product_name}</strong>
                        <span>{p.brands}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="meal-form">
              <div className="form-group">
                <label>Nom du repas</label>
                <input
                  type="text"
                  value={formData.mealName}
                  onChange={(e) => setFormData({...formData, mealName: e.target.value})}
                  placeholder="Ex: Couscous aux légumes"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Moment</label>
                  <select value={formData.mealTime} onChange={(e) => setFormData({...formData, mealTime: e.target.value})}>
                    <option>Petit-déjeuner</option>
                    <option>Déjeuner</option>
                    <option>Dîner</option>
                    <option>Collation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Calories (kcal)</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: e.target.value})}
                    placeholder="Auto si vide"
                  />
                </div>
              </div>

              <div className="form-row macros">
                <div className="form-group">
                  <label>Glucides (g)</label>
                  <input type="number" step="0.1" value={formData.carbsG} onChange={(e) => setFormData({...formData, carbsG: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Protéines (g)</label>
                  <input type="number" step="0.1" value={formData.proteinG} onChange={(e) => setFormData({...formData, proteinG: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Lipides (g)</label>
                  <input type="number" step="0.1" value={formData.fatG} onChange={(e) => setFormData({...formData, fatG: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="btn-log-meal" disabled={loading}>
                {loading ? 'Traitement...' : (!formData.calories ? '🪄 Estimer avec GlycoAI' : 'Enregistrer le repas')}
              </button>
            </form>
          </MedCard>
        </div>

        <div className="nutrition-right">
          <MedCard title="Résumé du Jour" icon="📊" className="summary-card">
            <div className="daily-macros-wheel">
              <div className="total-cal">
                <strong>{totals.cal}</strong>
                <span>kcal</span>
              </div>
              <div className="macro-breakdown">
                <div className="macro-item carbs">
                  <div className="bar" style={{ width: '45%' }}></div>
                  <span>Glucides: {totals.carbs.toFixed(1)}g</span>
                </div>
                <div className="macro-item protein">
                  <div className="bar" style={{ width: '30%' }}></div>
                  <span>Protéines: {totals.prot.toFixed(1)}g</span>
                </div>
                <div className="macro-item fat">
                  <div className="bar" style={{ width: '25%' }}></div>
                  <span>Lipides: {totals.fat.toFixed(1)}g</span>
                </div>
              </div>
            </div>
          </MedCard>

          <MedCard title="Historique Aujourd'hui" icon="🕒" className="history-card">
            <div className="meal-timeline">
              {logs.length === 0 ? (
                <p className="no-data">Aucun repas enregistré aujourd'hui.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h4>{log.meal_name}</h4>
                        <span className="time">{log.meal_time}</span>
                      </div>
                      <div className="timeline-macros">
                        <span>{log.calories} kcal</span>
                        <span>{log.carbs_g}g glucides</span>
                      </div>
                      {log.glycemic_impact && (
                        <div className="glycemic-tag">Impact: {log.glycemic_impact}</div>
                      )}
                    </div>
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

export default NutritionTracker;
