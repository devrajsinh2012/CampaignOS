import { useState, useCallback, useRef } from 'react';
import { streamAI, readStream } from '../lib/api';
import useStore from '../store/store';

/**
 * Hook for making streaming AI calls.
 * Returns: { response, loading, error, streamResponse, reset }
 */
export function useAI() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(false);
  const session = useStore((s) => s.session);
  const incrementAICalls = useStore((s) => s.incrementAICalls);

  const reset = useCallback(() => {
    setResponse('');
    setError(null);
    setLoading(false);
    abortRef.current = false;
  }, []);

  const abort = useCallback(() => {
    abortRef.current = true;
  }, []);

  const streamResponse = useCallback(
    async (endpoint, payload) => {
      setLoading(true);
      setError(null);
      setResponse('');
      abortRef.current = false;

      try {
        const token = session?.access_token;
        const reader = await streamAI(endpoint, payload, token);

        await readStream(
          reader,
          (chunk) => {
            if (abortRef.current) return;
            setResponse((prev) => prev + chunk);
          },
          () => {
            setLoading(false);
            incrementAICalls();
          }
        );
      } catch (err) {
        setError(err.message || 'AI request failed');
        setLoading(false);
      }
    },
    [session]
  );

  return { response, loading, error, streamResponse, reset, abort };
}
