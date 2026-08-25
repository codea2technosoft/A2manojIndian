// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';

let wsInstance = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const useWebSocket = (onMessage) => {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const isMounted = useRef(true);
  const isConnecting = useRef(false);

  const connect = () => {
    if (isConnecting.current) {
      console.log('⏳ Connection already in progress...');
      return;
    }

    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      console.log('✅ Using existing WebSocket connection');
      wsRef.current = wsInstance;
      setIsConnected(true);
      return;
    }

    try {
      isConnecting.current = true;
      // ✅ FIX: Change port to 3003 (your server port)
      const wsUrl = 'ws://localhost:9002';
      
      if (!wsInstance || wsInstance.readyState === WebSocket.CLOSED) {
        console.log('🔄 Creating new WebSocket connection to:', wsUrl);
        wsInstance = new WebSocket(wsUrl);
      }
      
      wsRef.current = wsInstance;

      wsInstance.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        isConnecting.current = false;
        reconnectAttempts = 0;
        
        wsInstance.send(JSON.stringify({
          type: 'register_admin',
          data: { username: 'admin' }
        }));
      };

      wsInstance.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received:', data.type);
          
          if (data.type === 'admin_deposit_created' || data.type === 'new_deposit_request') {
            console.log('💰 New deposit detected!');
            
            const eventId = Date.now() + '_' + Math.random().toString(36).substr(2, 6);
            window.dispatchEvent(new CustomEvent('newDeposit', {
              detail: {
                ...data.deposit,
                _eventId: eventId,
                _timestamp: Date.now()
              }
            }));
          }
          
          if (onMessage) {
            onMessage(data);
          }
          
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      wsInstance.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        isConnecting.current = false;
      };

      wsInstance.onclose = () => {
        console.log('❌ WebSocket disconnected');
        setIsConnected(false);
        isConnecting.current = false;
        
        if (isMounted.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          console.log(`🔄 Reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 5000);
        }
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
      isConnecting.current = false;
      if (isMounted.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
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