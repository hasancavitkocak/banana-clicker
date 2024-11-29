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

      return () => {
        socket.off('connectionStatus');
        socket.off('connect_error');
      };
    }
  }, [socket, reconnect]);

  const findMatch = useCallback(({ duration }) => {
    if (!isConnected || !socket) {
      logger.error('Socket not connected');
      return;
    }
    logger.info('Finding match with duration:', duration);
    socket.emit(SOCKET_EVENTS.FIND_MATCH, { duration });
  }, [socket, isConnected]);

  const cancelMatch = useCallback(() => {
    if (!isConnected || !socket) {
      logger.error('Socket not connected');
      return;
    }
    logger.info('Cancelling match');
    socket.emit(SOCKET_EVENTS.MATCH_CANCELLED);
  }, [socket, isConnected]);

  const updateScore = useCallback(({ gameId, score, clicks, maxCombo }) => {
    if (!isConnected || !socket) {
      logger.error('Socket not connected');
      return;
    }
    socket.emit(SOCKET_EVENTS.UPDATE_SCORE, { gameId, score, clicks, maxCombo });
  }, [socket, isConnected]);

  const surrender = useCallback(({ gameId }) => {
    if (!isConnected || !socket) {
      logger.error('Socket not connected');
      return;
    }
    socket.emit(SOCKET_EVENTS.SURRENDER, { gameId });
  }, [socket, isConnected]);

  const endGame = useCallback(({ gameId }) => {
    if (!isConnected || !socket) {
      logger.error('Socket not connected');
      return;
    }
    socket.emit(SOCKET_EVENTS.GAME_ENDED, { gameId });
  }, [socket, isConnected]);

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