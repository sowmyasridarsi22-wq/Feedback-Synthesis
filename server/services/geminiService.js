
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

const getModel = () =>
  process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

/**
 * Parse JSON returned by Groq, including responses wrapped in Markdown.
 */
function parseJson(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Groq returned an empty response.');
  }

  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start === -1 || end <= start) {
      throw new Error('Groq response did not contain a valid JSON object.');
    }

    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      throw new Error('Groq returned malformed JSON. Try a smaller batch.');
    }
  }
}

/**
 * Send a prompt to Groq Chat Completions.
 */
async function callGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing from server/.env');
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: getModel(),
      messages: [
        {
          role: 'system',
          content:
            'You are a customer feedback analyst. Follow the requested schema carefully. Return one valid JSON object only, without Markdown fences or explanatory text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_completion_tokens: 8192
    })
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Groq API error ${response.status}: ${responseText}`
    );
  }

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error('Could not parse the Groq API response.');
  }

  const choice = data.choices?.[0];
  const content = choice?.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error(
      `Groq returned no content. Finish reason: ${choice?.finish_reason || 'unknown'}`
    );
  }

  if (choice.finish_reason === 'length') {
    throw new Error(
      'Groq response was truncated. Reduce BATCH_SIZE and retry.'
    );
  }

  return parseJson(content);
}

/**
 * Analyze a batch of feedback records.
 * Returns an array, preserving the controller's expected interface.
 */
export async function analyzeBatch(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const feedback = items.map((item, index) => ({
    id: index,
    feedback:
      typeof item === 'string'
        ? item
        : JSON.stringify(item)
  }));

  const prompt = `
Analyze the customer feedback records below.

Return exactly one JSON object with this structure:
{
  "items": [
    {
      "sentiment": "Positive",
      "sentimentScore": 80,
      "category": "Usability",
      "topic": "Navigation",
      "subtopic": null,
      "issue": null,
      "keywords": ["navigation", "interface", "usability"],
      "featureRequest": false,
      "requestedFeature": null,
      "severity": "Low",
      "summary": "A concise summary of the feedback."
    }
  ]
}

Rules:
- Return exactly ${items.length} objects in the items array.
- Keep results in the same order as the input.
- Use the input id order to match each result to its feedback.
- sentiment must be Positive, Neutral, or Negative.
- sentimentScore must be an integer from 0 to 100.
- category and topic must be short, meaningful labels.
- subtopic and issue may be null if not applicable.
- keywords must be an array of 3 to 8 strings.
- featureRequest must be true or false.
- requestedFeature must be a string or null.
- severity must be Low, Medium, High, or Critical.
- summary must briefly describe the actual feedback.
- Do not invent information.
- Return valid JSON only.

Feedback records:
${JSON.stringify(feedback)}
`;

  const result = await callGroq(prompt);

  if (!Array.isArray(result.items)) {
    throw new Error('Groq response is missing the items array.');
  }

  if (result.items.length !== items.length) {
    throw new Error(
      `Expected ${items.length} results but Groq returned ${result.items.length}.`
    );
  }

  return result.items;
}

/**
 * Generate an aggregate synthesis.
 * Kept for compatibility with existing controller imports.
 */
export async function synthesize(stats) {
  const prompt = `
Create an evidence-based synthesis of these aggregated customer
feedback statistics.

Return one JSON object with these fields:
{
  "summary": "A concise overall summary.",
  "positiveThemes": [],
  "negativeThemes": [],
  "emergingIssues": [],
  "recommendations": []
}

All four theme and recommendation fields must be arrays of strings.
Use only the supplied statistics. Do not invent facts.
Return valid JSON only.

Statistics:
${JSON.stringify(stats)}
`;

  return callGroq(prompt);
}
