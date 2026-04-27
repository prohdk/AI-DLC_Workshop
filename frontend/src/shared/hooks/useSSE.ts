import { useEffect, useRef, useState, useCallback } from 'react';

interface UseSSEOptions {
  url: string;
  token: string | null;
  onEvent?: (event: string, data: unknown) => void;
}

export function useSSE({ url, token, onEvent }: UseSSEOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    if (!token) return;
    const fullUrl = `${url}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(fullUrl);
    esRef.current = es;

    es.onopen = () => setIsConnected(true);
    es.onerror = () => {
      setIsConnected(false);
      es.close();
      setTimeout(connect, 3000);
    };

    const eventTypes = ['new_order', 'order_status_changed', 'order_deleted', 'session_completed'];
    eventTypes.forEach((type) => {
      es.addEventListener(type, (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          onEventRef.current?.(type, data);
        } catch { /* ignore parse errors */ }
      });
    });
  }, [url, token]);

  useEffect(() => {
    connect();
    return () => { esRef.current?.close(); };
  }, [connect]);

  return { isConnected };
}
