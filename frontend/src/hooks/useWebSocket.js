import { useEffect, useRef } from 'react';

export const useWebSocket = (onMessage) => {
  const ws = useRef(null);

  useEffect(() => {
    const connectWS = () => {
      const wsUrl = process.env.REACT_APP_BACKEND_URL.replace('https://', 'wss://').replace('http://', 'ws://');
      ws.current = new WebSocket(`${wsUrl}/ws`);
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {}
      };

      ws.current.onerror = () => setTimeout(connectWS, 5000);
      ws.current.onclose = () => setTimeout(connectWS, 5000);
    };

    connectWS();
    return () => ws.current?.close();
  }, [onMessage]);
};
