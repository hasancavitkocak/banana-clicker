import { useCallback } from 'react';
import { useSocketConnection } from './useSocketConnection';
import { SOCKET_EVENTS } from '../config/socketConfig';

export function useSocket() {
  const { socket, isConnected } = useSocketConnection();

  const findMatch = useCallback((duration: number) => {
    if (!isConnected || !socket) {
      console.error('Socket not connected');
      return;
    }
    socket.emit(SOCKET_EVENTS.FIND_MATCH, { duration });
  }, [socket, isConnected]);

  const cancelMatch = useCallback(() => {
    if (!isConnected || !socket) return;
    socket.emit(SOCKET_EVENTS.MATCH_CANCELLED);
  }, [socket, isConnected]);

  const updateScore = useCallback((gameId: string, score: number, clicks: number, maxCombo: number) => {
    if (!isConnected || !socket) return;
    socket.emit(SOCKET_EVENTS.UPDATE_SCORE, { gameId, score, clicks, maxCombo });
  }, [socket, isConnected]);

  const surrender = useCallback((gameId: string) => {
    if (!isConnected || !socket) return;
    socket.emit(SOCKET_EVENTS.SURRENDER, { gameId });
  }, [socket, isConnected]);

  const endGame = useCallback((gameId: string) => {
    if (!isConnected || !socket) return;
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