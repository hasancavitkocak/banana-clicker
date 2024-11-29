import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { socketConfig, getSocketUrl, SOCKET_EVENTS } from '../config/socketConfig';

export function useSocketConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!socketRef.current && reconnectAttempts.current < maxReconnectAttempts) {
      const url = getSocketUrl();
      socketRef.current = io(url, {
        ...socketConfig,
        transports: reconnectAttempts.current === 0 ? ['websocket'] : ['websocket', 'polling']
      });

      socketRef.current.on(SOCKET_EVENTS.CONNECT, () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        console.log('Connected to server');
      });

      socketRef.current.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
        console.error('Connection error:', err);
        setError(err);
        setIsConnected(false);
        reconnectAttempts.current += 1;

        if (reconnectAttempts.current < maxReconnectAttempts) {
          setTimeout(() => {
            if (socketRef.current) {
              socketRef.current.disconnect();
              socketRef.current = null;
            }
            connect();
          }, 1000 * Math.min(reconnectAttempts.current, 5));
        }
      });

      socketRef.current.on(SOCKET_EVENTS.DISCONNECT, () => {
        setIsConnected(false);
        console.log('Disconnected from server');
      });
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        setError(null);
        reconnectAttempts.current = 0;
      }
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    reconnectAttempts.current = 0;
    connect();
  }, [connect]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
    reconnect
  };
}