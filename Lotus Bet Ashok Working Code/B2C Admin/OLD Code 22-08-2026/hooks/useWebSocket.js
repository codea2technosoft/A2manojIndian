// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (onMessage) => {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  const connect = () => {
    try {
      wsRef.current = new WebSocket('ws://localhost:9002');

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        
        // Register as admin
        wsRef.current.send(JSON.stringify({
          type: 'register_admin',
          data: { username: 'admin' }
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received:', data.type);
          
          // 🔔 Handle new deposit request
          if (data.type === 'admin_deposit_created' || data.type === 'new_deposit_request') {
            console.log('💰 New deposit detected:', data.deposit);
            
            // ✅ TRIGGER SOUND - Dispatch custom event
            window.dispatchEvent(new CustomEvent('newDeposit', {
              detail: data.deposit
            }));
          }
          
          // Call callback
          if (onMessage) {
            onMessage(data);
          }
          
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      wsRef.current.onclose = () => {
        console.log('❌ WebSocket disconnected');
        setIsConnected(false);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect...');
          connect();
        }, 5000);
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = (data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  return { ws: wsRef.current, isConnected, sendMessage };
};