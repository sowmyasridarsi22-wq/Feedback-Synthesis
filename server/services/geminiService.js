const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

const endpoint =
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

function extract(text) {
  const cleaned = text
    .replace(/^```(?:json)?/, '')
    .replace(/```$/, '')
    .trim();

  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');

  if (start === -1 || end === -1) {
    throw new Error('Gemini returned invalid JSON array');
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function analyzeBatch(items) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const prompt = `You are an expert customer feedback and product analyst. Analyze each item objectively. Do not invent facts. Return ONLY a JSON array in the same order. Each object must contain: sentiment (Positive/Neutral/Negative), sentimentScore (0-100), category, topic, subtopic, issue (string or null), keywords (array of 3-8 strings), featureRequest (boolean), requestedFeature (string or null), severity (Low/Medium/High/Critical), summary. Normalize similar topic names. Feedback:
${items.map((x, i) => `${i}. ${x}`).join('\n')}`;

  const r = await fetch(
    `${endpoint}?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    }
  );

  if (!r.ok) {
    const errorText = await r.text();
    throw new Error(`Gemini API error ${r.status}: ${errorText}`);
  }

  const j = await r.json();

  const text =
    j.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return extract(text);
}

export async function synthesize(stats) {
  if (!process.env.GEMINI_API_KEY) {
    return {
      summary: 'Gemini API key is not configured.',
      recommendations: []
    };
  }

  const prompt = `Create a concise evidence-based executive synthesis from these aggregated feedback statistics. Do not invent facts. Return JSON with summary, positiveThemes (array), negativeThemes (array), emergingIssues (array), recommendations (array). Statistics:
${JSON.stringify(stats).slice(0, 30000)}`;

  const r = await fetch(
    `${endpoint}?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
    }
  );

  if (!r.ok) {
    const errorText = await r.text();
    throw new Error(`Gemini API error ${r.status}: ${errorText}`);
  }

  const j = await r.json();

  const text =
    j.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  return JSON.parse(
    text
      .replace(/^```json/, '')
      .replace(/```$/, '')
      .trim()
  );
}