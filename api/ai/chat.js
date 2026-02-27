// Vercel Serverless Function — AI Chat Endpoint
// Streams AI response for AI Consultant Chat (with full conversation history)

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { systemPrompt, messages, userMessage } = req.body;

    // Support both formats: {messages} array or single {userMessage}
    let chatMessages = [];
    if (messages && Array.isArray(messages)) {
      chatMessages = messages;
    } else if (userMessage) {
      chatMessages = [{ role: 'user', content: userMessage }];
    } else {
      return res.status(400).json({ error: 'messages or userMessage is required' });
    }

    const apiKey = process.env.LLM_API_KEY;
    const baseUrl = process.env.LLM_API_BASE_URL || 'https://integrate.api.nvidia.com/v1';
    const model = process.env.LLM_MODEL_NAME || 'moonshotai/kimi-k2';

    if (!apiKey) {
      return res.status(500).json({ error: 'LLM API key not configured' });
    }

    const fullMessages = [
      { role: 'system', content: systemPrompt || 'You are a helpful marketing consultant.' },
      ...chatMessages,
    ];

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: fullMessages,
        stream: true,
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LLM API error:', response.status, errorText);
      return res.status(response.status).json({ error: `LLM API error: ${response.status}` });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
    } catch (streamErr) {
      console.error('Stream error:', streamErr);
    }

    res.end();
  } catch (err) {
    console.error('Chat API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
