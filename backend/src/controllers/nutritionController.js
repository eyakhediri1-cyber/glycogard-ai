const pool = require('../db/connection');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const addNutritionLog = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { mealName, calories, carbsG, proteinG, fatG, logDate, mealTime, autoEstimate } = req.body;

    if (!mealName || !logDate) {
      return res.status(400).json({ error: 'Meal name and date are required' });
    }

    let finalCalories = calories;
    let finalCarbs = carbsG;
    let finalProtein = proteinG;
    let finalFat = fatG;
    let glycemicImpact = null;

    // AI Estimation logic if autoEstimate is true or if values are missing
    if (autoEstimate || (!calories && !carbsG)) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "system",
              content: "You are a professional clinical dietician specializing in diabetes. Estimate the nutritional content of meals with high precision. Return ONLY a strict JSON object."
            },
            {
              role: "user",
              content: `Estimate nutrition for: "${mealName}". Return JSON format: { "calories": 450, "glucides": 55, "proteines": 18, "lipides": 14, "index_glycemique_estime": "moyen", "impact_glycemique": "Hausse progressive sur 2h" }`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
        });

        const estimation = JSON.parse(response.choices[0].message.content);
        finalCalories = estimation.calories || 0;
        finalCarbs = estimation.glucides || 0;
        finalProtein = estimation.proteines || 0;
        finalFat = estimation.lipides || 0;
        glycemicImpact = estimation.impact_glycemique;
      } catch (aiError) {
        console.error('AI Nutrition Estimation failed:', aiError);
        finalCalories = finalCalories || 0;
      }
    }

    const result = await pool.query(
      `INSERT INTO nutrition_logs (user_id, meal_name, calories, carbs_g, protein_g, fat_g, log_date, meal_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, meal_name, calories, carbs_g, protein_g, fat_g, log_date, meal_time`,
      [userId, mealName, finalCalories, finalCarbs, finalProtein, finalFat, logDate, mealTime]
    );

    res.status(201).json({
      message: 'Nutrition log added',
      log: result.rows[0],
      estimated: autoEstimate || (!calories && !carbsG)
    });
  } catch (error) {
    console.error('Error adding nutrition log:', error);
    res.status(500).json({ error: 'Failed to add nutrition log' });
  }
};

const getNutritionLogs = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { logDate } = req.query;

    let query = `SELECT id, meal_name, calories, carbs_g, protein_g, fat_g, log_date, meal_time
       FROM nutrition_logs 
       WHERE user_id = $1`;
    const params = [userId];

    if (logDate) {
      query += ` AND log_date = $2`;
      params.push(logDate);
    }

    query += ` ORDER BY meal_time DESC`;

    const result = await pool.query(query, params);

    res.json({
      count: result.rows.length,
      logs: result.rows,
    });
  } catch (error) {
    console.error('Error fetching nutrition logs:', error);
    res.status(500).json({ error: 'Failed to fetch nutrition logs' });
  }
};

const getNutritionStats = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT 
        ROUND(AVG(calories)::numeric, 2) as avg_calories,
        ROUND(AVG(carbs_g)::numeric, 2) as avg_carbs,
        ROUND(AVG(protein_g)::numeric, 2) as avg_protein,
        ROUND(AVG(fat_g)::numeric, 2) as avg_fat,
        COUNT(DISTINCT log_date) as days_logged
       FROM nutrition_logs 
       WHERE user_id = $1 AND log_date >= CURRENT_DATE - INTERVAL '${days} days'`,
      [userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error calculating nutrition stats:', error);
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
};

module.exports = {
  addNutritionLog,
  getNutritionLogs,
  getNutritionStats,
};
