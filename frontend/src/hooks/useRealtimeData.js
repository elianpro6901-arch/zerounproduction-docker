import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

export const useRealtimeData = (fetchFn, dataType) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const result = await fetchFn();
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => { fetch(); }, [fetch]);

  useWebSocket(useCallback((msg) => {
    if (msg.type === dataType) fetch();
  }, [fetch, dataType]));

  return { data, loading, refresh: fetch };
};
