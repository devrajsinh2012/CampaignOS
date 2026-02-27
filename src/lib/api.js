const API_BASE = '/api';

/**
 * Make an AI API call with streaming support. 
 * Returns a ReadableStream reader for streaming responses.
 */
export async function streamAI(endpoint, payload, token) {
  const res = await fetch(`${API_BASE}/ai/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  return res.body.getReader();
}

/**
 * Non-streaming AI call — returns full JSON response.
 */
export async function callAI(endpoint, payload, token) {
  const res = await fetch(`${API_BASE}/ai/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Generic fetch wrapper for non-AI endpoints.
 */
export async function apiFetch(path, options = {}, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Read a streaming response and call onChunk for each text delta.
 */
export async function readStream(reader, onChunk, onDone) {
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            onDone?.();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) onChunk(content);
          } catch {
            // Non-JSON line — treat as raw text
            if (data) onChunk(data);
          }
        }
      }
    }
    onDone?.();
  } catch (err) {
    console.error('Stream read error:', err);
    onDone?.();
  }
}
