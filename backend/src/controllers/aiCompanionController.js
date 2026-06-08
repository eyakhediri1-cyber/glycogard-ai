const pool = require('../db/connection');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sendMessage = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. Get user profile
    const userResult = await pool.query(
      'SELECT first_name, last_name, weight_kg, height_cm, diabetes_type, diagnosis_year, date_of_birth FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const age = new Date().getFullYear() - new Date(user.date_of_birth).getFullYear();

    // 2. Get recent glucose stats (24h)
    const glucoseResult = await pool.query(
      `WITH readings AS (
        SELECT glucose_level FROM blood_sugar_records 
        WHERE user_id = $1 AND measurement_time >= NOW() - INTERVAL '24 hours'
      )
      SELECT 
        AVG(glucose_level) as avg_g,
        COUNT(*) FILTER (WHERE glucose_level BETWEEN 70 AND 180) * 100.0 / NULLIF(COUNT(*), 0) as tir
      FROM readings`,
      [userId]
    );

    const stats = glucoseResult.rows[0];
    const currentGlucose = await pool.query(
      'SELECT glucose_level, measurement_time FROM blood_sugar_records WHERE user_id = $1 ORDER BY measurement_time DESC LIMIT 1',
      [userId]
    );

    // 3. Get medications
    const medsResult = await pool.query(
      'SELECT name, dosage FROM medications WHERE user_id = $1',
      [userId]
    );
    const meds = medsResult.rows.map(m => `${m.name} (${m.dosage})`).join(', ');

    // 4. Get latest nutrition
    const mealResult = await pool.query(
      'SELECT meal_name, created_at FROM nutrition_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    const lastMeal = mealResult.rows[0];
    const lastMealHours = lastMeal ? Math.round((new Date() - new Date(lastMeal.created_at)) / (1000 * 60 * 60)) : 'N/A';

    // 5. Build Professional System Prompt
    const systemPrompt = `
Tu es GlycoAI, l'assistant IA spécialisé en diabétologie de l'application GlycoGuard.
Tu parles couramment Français, Arabe, Darija (arabe marocain/tunisien), et Anglais.
Adapte automatiquement ta langue à celle du patient.

DONNÉES PATIENT EN TEMPS RÉEL :
- Nom : ${user.first_name} ${user.last_name}, Âge : ${age} ans
- Type de diabète : ${user.diabetes_type}
- Glycémie actuelle : ${currentGlucose.rows[0]?.glucose_level || 'N/A'} mg/dL
- TIR des 24h : ${stats.tir ? Math.round(stats.tir) : 'N/A'}%
- HbA1c estimée : ${stats.avg_g ? ((stats.avg_g + 46.7) / 28.7).toFixed(1) : 'N/A'}%
- Médicaments actuels : ${meds || 'Aucun enregistré'}
- Dernier repas : ${lastMeal?.meal_name || 'N/A'} (il y a ${lastMealHours}h)
- Activité physique aujourd'hui : aucune enregistrée

CAPACITÉS :
1. Analyser les tendances glycémiques et donner des conseils personnalisés
2. Expliquer l'impact des aliments sur la glycémie
3. Guider sur l'activité physique adaptée au diabète
4. Alerter sur les signes d'hypo/hyperglycémie
5. Répondre aux questions médicales générales sur le diabète
6. Générer des rapports de synthèse pour le médecin

RÈGLES ABSOLUES :
- Toujours rappeler de consulter un médecin pour les décisions thérapeutiques importantes
- Ne jamais recommander de modifier les doses d'insuline sans avis médical
- En cas de glycémie < 70 mg/dL : PRIORITÉ ABSOLUE — instructions d'urgence immédiates
- Répondre de façon concise (max 200 mots) sauf si le patient demande plus de détails
- Utiliser des emojis médicaux avec parcimonie pour améliorer la lisibilité
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const aiResponse = response.choices[0].message.content;

    // Save to chat history
    await pool.query(
      `INSERT INTO chat_history (user_id, message_text, response_text, message_type)
       VALUES ($1, $2, $3, $4)`,
      [userId, message, aiResponse, 'User-Chat']
    );

    res.json({
      userMessage: message,
      aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

const chatHistory = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { limit = 20 } = req.query;

    const result = await pool.query(
      `SELECT id, message_text, response_text, message_type, created_at
       FROM chat_history 
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, parseInt(limit)]
    );

    res.json({
      count: result.rows.length,
      messages: result.rows.reverse(),
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

module.exports = { sendMessage, chatHistory };
