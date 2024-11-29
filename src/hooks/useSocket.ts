import { useCallback, useEffect } from 'react';
import { useSocketConnection } from './useSocketConnection';
import { SOCKET_EVENTS } from '../config/socketConfig';
import { logger } from '../utils/logger';

export function useSocket() {
  const { socket, isConnected, reconnect } = useSocketConnection();

  useEffect(() => {
    if (socket) {
      socket.on('connectionStatus', (status) => {
        logger.info('Connection status:', status);
      });

      socket.on('connect_error', (error) => {
        logger.error('Connection error:', error);
        setTimeout(reconnect, 1000);
      });
    }
  }, [socket, reconnect]);

  const findMatch = useCallback(({ duration, region, skillLevel }) => {
    if (!isConnected || !socket) {
      logger.error('Socket not connected');
      return;
    }
    logger.info('Finding match with params:', { duration, region, skillLevel });
    socket.emit(SOCKET_EVENTS.FIND_MATCH, { duration, region, skillLevel });
  }, [socket, isConnected]);

  // ... rest of the existing code ...

  return {
    socket,
    isConnected,
    findMatch,
    cancelMatch,
    updateScore,
    surrender,
    endGame
  };
}