// Vercel Serverless Function — AI Quiz Endpoint
// Generates quiz questions (non-streaming JSON response)

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { systemPrompt, userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    const apiKey = process.env.LLM_API_KEY;
    const baseUrl = process.env.LLM_API_BASE_URL || 'https://integrate.api.nvidia.com/v1';
    const model = process.env.LLM_MODEL_NAME || 'meta/llama-3.3-70b-instruct';

    if (!apiKey) {
      return res.status(500).json({ error: 'LLM API key not configured' });
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt || 'You are a quiz generator for digital marketing topics.' },
          { role: 'user', content: userMessage },
        ],
        stream: false,
        max_tokens: 2048,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LLM API error:', response.status, errorText);
      return res.status(response.status).json({ error: `LLM API error: ${response.status}` });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Try to parse as JSON (quiz format)
    try {
      // Extract JSON from markdown code blocks if present
      let jsonStr = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      const quiz = JSON.parse(jsonStr);
      return res.status(200).json({ quiz });
    } catch {
      // Return raw content if not valid JSON
      return res.status(200).json({ content });
    }
  } catch (err) {
    console.error('Quiz API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
