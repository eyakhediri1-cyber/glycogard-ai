const pool = require('../db/connection');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const calculateHealthRiskScore = async (userId) => {
  try {
    // 1. Get user profile and metrics
    const userResult = await pool.query(
      'SELECT diagnosis_year, smoker, has_hypertension, last_eye_exam, last_foot_exam, weight_kg, height_cm FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];

    // 2. Get latest HbA1c and BMI
    const hmResult = await pool.query(
      'SELECT hba1c, bmi FROM health_metrics WHERE user_id = $1 ORDER BY measurement_date DESC LIMIT 1',
      [userId]
    );
    const metrics = hmResult.rows[0];

    // 3. Get TIR (Time In Range) from last 7 days
    const tirResult = await pool.query(
      `SELECT COUNT(*) FILTER (WHERE glucose_level BETWEEN 70 AND 180) * 100.0 / NULLIF(COUNT(*), 0) as tir
       FROM blood_sugar_records 
       WHERE user_id = $1 AND measurement_time >= NOW() - INTERVAL '7 days'`,
      [userId]
    );

    const hba1c = parseFloat(metrics?.hba1c || 0);
    const tir = parseFloat(tirResult.rows[0]?.tir || 100);
    const yearsWithDiabetes = new Date().getFullYear() - user.diagnosis_year;
    const bmi = parseFloat(metrics?.bmi || (user.weight_kg / ((user.height_cm/100)**2)) || 0);

    let renal = 0, retinal = 0, foot = 0;
    let riskFactors = [];

    // Renal Risk (spec: HbA1c > 8 and hypertension)
    if (hba1c > 8) renal += 60;
    if (user.has_hypertension) renal += 40;

    // Retinal Risk (spec: TIR + date of last eye exam)
    if (tir < 70) retinal += 55;
    if (!user.last_eye_exam || (new Date() - new Date(user.last_eye_exam)) / (1000 * 60 * 60 * 24) > 365) retinal += 45;

    // Foot Risk (spec: smoking + BMI)
    if (user.smoker) foot += 55;
    if (bmi > 30) foot += 45;

    const globalScore = Math.round((renal + retinal + foot) / 3);
    const normalizedScore = Math.min(globalScore, 100);

    if (hba1c > 8) riskFactors.push('Poor glycemic control (HbA1c > 8%)');
    if (user.smoker) riskFactors.push('Active smoking');
    if (user.has_hypertension) riskFactors.push('Hypertension');
    if (tir < 70) riskFactors.push('Low Time in Range');

    let riskLevel = 'Low';
    if (normalizedScore >= 70) riskLevel = 'Critical';
    else if (normalizedScore >= 50) riskLevel = 'High';
    else if (normalizedScore >= 30) riskLevel = 'Moderate';

    return { 
      normalizedScore, 
      riskLevel, 
      riskFactors,
      renal: Math.min(renal, 100),
      retinal: Math.min(retinal, 100),
      foot: Math.min(foot, 100)
    };
  } catch (error) {
    console.error('Error calculating risk score:', error);
    return { normalizedScore: 0, riskLevel: 'Unknown', riskFactors: [] };
  }
};

const assessHealthRisk = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const results = await calculateHealthRiskScore(userId);

    // Save to the professional risk_scores table
    await pool.query(
      `INSERT INTO risk_scores (user_id, renal_risk, retinal_risk, foot_risk, global_score)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, results.renal, results.retinal, results.foot, results.normalizedScore]
    );

    // Also save to legacy risk_assessments for compatibility
    const recommendations = results.normalizedScore >= 70 ? 'URGENT: Consult doctor.' : 'Continue monitoring.';
    const result = await pool.query(
      `INSERT INTO risk_assessments (user_id, risk_type, risk_score, risk_level, recommendations, assessment_date)
       VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
       RETURNING id, risk_score, risk_level, recommendations, assessment_date`,
      [userId, 'Comprehensive Health', results.normalizedScore, results.riskLevel, recommendations]
    );

    res.json({
      assessment: result.rows[0],
      breakdown: {
        renal: results.renal,
        retinal: results.retinal,
        foot: results.foot
      },
      riskFactors: results.riskFactors,
    });
  } catch (error) {
    console.error('Error assessing health risk:', error);
    res.status(500).json({ error: 'Failed to assess health risk' });
  }
};

const getRiskAssessments = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const result = await pool.query(
      `SELECT id, risk_type, risk_score, risk_level, recommendations, assessment_date
       FROM risk_assessments 
       WHERE user_id = $1
       ORDER BY assessment_date DESC LIMIT 10`,
      [userId]
    );

    res.json({
      count: result.rows.length,
      assessments: result.rows,
    });
  } catch (error) {
    console.error('Error fetching risk assessments:', error);
    res.status(500).json({ error: 'Failed to fetch risk assessments' });
  }
};

const getAIInsights = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    const results = await calculateHealthRiskScore(userId);

    const prompt = `As GlycoAI, provide professional diabetes insights for ${user.first_name}. 
    Risk: ${results.riskLevel} (${results.normalizedScore}/100). 
    Breakdown: Renal ${results.renal}%, Retinal ${results.retinal}%, Foot ${results.foot}%. 
    Factors: ${results.riskFactors.join(', ')}. 
    Provide 3-4 specific clinical recommendations in the patient's language.
    Return strict JSON only, with this shape: {"insights":"...single markdown string..."}.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        { role: 'system', content: 'You are GlycoAI, a professional diabetes health consultant. Return only JSON.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 500,
    });

    const parsed = JSON.parse(response.choices[0].message.content || '{}');
    const insights = parsed.insights || parsed.recommendations || 'No insights generated.';

    res.json({
      insights,
      riskLevel: results.riskLevel,
      riskScore: results.normalizedScore,
      breakdown: {
        renal: results.renal,
        retinal: results.retinal,
        foot: results.foot
      }
    });
  } catch (error) {
    console.error('Error getting AI insights:', error);
    res.status(500).json({ error: 'Failed to get AI insights' });
  }
};

module.exports = {
  assessHealthRisk,
  getRiskAssessments,
  getAIInsights,
  calculateHealthRiskScore,
};
