import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { socketConfig, getSocketUrl, SOCKET_EVENTS } from '../config/socketConfig';
import { logger } from '../utils/logger';

export function useSocketConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!socketRef.current && reconnectAttempts.current < maxReconnectAttempts) {
      const url = getSocketUrl();
      logger.info('Connecting to socket server:', url);

      socketRef.current = io(url, {
        ...socketConfig,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000
      });

      socketRef.current.on(SOCKET_EVENTS.CONNECT, () => {
        logger.info('Connected to server');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      });

      socketRef.current.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
        logger.error('Connection error:', err);
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

      socketRef.current.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
        logger.info('Disconnected from server:', reason);
        setIsConnected(false);
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