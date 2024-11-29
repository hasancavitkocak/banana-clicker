import { useState, useCallback } from 'react';
import { GameState, GameDuration } from '../types/game';
import { useSoundEffects } from './useSoundEffects';
import { useSocket } from './useSocket';

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    clicks: 0,
    timeLeft: 5,
    isPlaying: false,
    combo: 1,
    maxCombo: 1,
    lastClickTime: 0,
    highScore: parseInt(localStorage.getItem('highScore') || '0', 10),
    gameDuration: 5,
    isMatchmaking: false,
    showResults: false,
    surrendered: false,
    opponentDisconnected: false
  });

  const { playClick, playCombo } = useSoundEffects();
  const { socket, findMatch, cancelMatch, updateScore, surrender: socketSurrender } = useSocket();

  const handleClick = useCallback(() => {
    if (!gameState.isPlaying) return;

    const now = Date.now();
    const timeSinceLastClick = now - gameState.lastClickTime;
    const newCombo = timeSinceLastClick < 1000 ? Math.min(gameState.combo + 1, 5) : 1;
    const points = 10 * newCombo;

    if (newCombo > gameState.combo) {
      playCombo();
    } else {
      playClick();
    }

    const newState = {
      score: gameState.score + points,
      clicks: gameState.clicks + 1,
      combo: newCombo,
      maxCombo: Math.max(gameState.maxCombo, newCombo),
      lastClickTime: now
    };

    setGameState(prev => ({
      ...prev,
      ...newState
    }));

    if (gameState.gameId) {
      updateScore({
        gameId: gameState.gameId,
        score: newState.score,
        clicks: newState.clicks,
        maxCombo: newState.maxCombo
      });
    }
  }, [gameState, playClick, playCombo, updateScore]);

  const surrender = useCallback(() => {
    if (gameState.gameId) {
      socketSurrender({ gameId: gameState.gameId });
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        showResults: true,
        surrendered: true
      }));
    }
  }, [gameState.gameId, socketSurrender]);

  const startMatchmaking = useCallback(() => {
    if (socket) {
      findMatch({ duration: gameState.gameDuration });
      setGameState(prev => ({
        ...prev,
        isMatchmaking: true,
        showResults: false,
        surrendered: false,
        opponentScore: undefined,
        opponentClicks: undefined,
        opponentMaxCombo: undefined,
        opponentDisconnected: false
      }));
    }
  }, [socket, findMatch, gameState.gameDuration]);

  const closeMatch = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showResults: false,
      score: 0,
      clicks: 0,
      combo: 1,
      maxCombo: 1,
      opponentScore: undefined,
      opponentClicks: undefined,
      opponentMaxCombo: undefined,
      surrendered: false,
      opponentDisconnected: false,
      gameId: undefined
    }));
  }, []);

  return {
    gameState,
    surrender,
    startMatchmaking,
    cancelMatchmaking: cancelMatch,
    handleClick,
    setGameDuration: (duration: GameDuration) => 
      setGameState(prev => ({ ...prev, gameDuration: duration })),
    closeMatch
  };
}