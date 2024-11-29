import { useState, useEffect, useCallback } from 'react';
import { GameState, GameDuration } from '../types/game';
import { useSoundEffects } from './useSoundEffects';
import { useSocket } from './useSocket';

const BASE_POINTS = 10;
const COMBO_MULTIPLIER_RATE = 0.1;
const COMBO_WINDOW = 500;
const COUNTDOWN_START = 3;
const COMBO_SOUND_INTERVAL = 10;

// Simulation settings
const SIMULATION_MATCH_DELAY = 2000;
const SIMULATION_SCORE_INTERVAL = 1000;

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
    opponentDisconnected: false,
  });

  const [simulationMode, setSimulationMode] = useState(false);
  const { playClick, playCombo, playCountdown, playStart } = useSoundEffects();
  const { socket, findMatch, updateScore, surrender: emitSurrender, cancelMatch } = useSocket();

  const updateHighScore = useCallback((newScore: number) => {
    if (newScore > gameState.highScore) {
      localStorage.setItem('highScore', newScore.toString());
      setGameState(prev => ({ ...prev, highScore: newScore }));
    }
  }, [gameState.highScore]);

  const simulateOpponentScore = useCallback(() => {
    if (!gameState.isPlaying || !simulationMode) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const randomIncrement = Math.floor(Math.random() * 30) + 10;
        const newOpponentScore = (prev.opponentScore || 0) + randomIncrement;
        const newOpponentClicks = (prev.opponentClicks || 0) + 1;
        const newOpponentMaxCombo = Math.max(prev.opponentMaxCombo || 1, Math.floor(Math.random() * 3) + 1);

        return {
          ...prev,
          opponentScore: newOpponentScore,
          opponentClicks: newOpponentClicks,
          opponentMaxCombo: newOpponentMaxCombo,
        };
      });
    }, SIMULATION_SCORE_INTERVAL);

    return () => clearInterval(interval);
  }, [gameState.isPlaying, simulationMode]);

  const handleClick = useCallback(() => {
    if (!gameState.isPlaying) return;

    playClick();
    const now = Date.now();
    const timeDiff = now - gameState.lastClickTime;
    let newCombo = gameState.combo;

    if (timeDiff < COMBO_WINDOW) {
      newCombo = gameState.combo + 1;
      if (newCombo % COMBO_SOUND_INTERVAL === 0) {
        playCombo();
      }
    } else {
      newCombo = 1;
    }

    const comboMultiplier = 1 + ((newCombo - 1) * COMBO_MULTIPLIER_RATE);
    const points = Math.round(BASE_POINTS * comboMultiplier);

    setGameState(prev => {
      const newState = {
        ...prev,
        score: prev.score + points,
        clicks: prev.clicks + 1,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        lastClickTime: now,
      };

      if (prev.gameId && !simulationMode) {
        updateScore(prev.gameId, newState.score, newState.clicks, newState.maxCombo);
      }

      return newState;
    });
  }, [gameState.isPlaying, gameState.lastClickTime, gameState.combo, gameState.maxCombo, gameState.gameId, simulationMode, playClick, playCombo, updateScore]);

  const startGame = useCallback(() => {
    playStart();
    setGameState(prev => ({
      ...prev,
      score: 0,
      clicks: 0,
      timeLeft: prev.gameDuration,
      isPlaying: true,
      combo: 1,
      maxCombo: 1,
      lastClickTime: Date.now(),
      countdown: COUNTDOWN_START,
      opponentScore: 0,
      opponentClicks: 0,
      opponentMaxCombo: 1,
    }));
  }, [playStart]);

  const endGame = useCallback(() => {
    setGameState(prev => {
      updateHighScore(prev.score);
      return {
        ...prev,
        isPlaying: false,
        showResults: true,
      };
    });
  }, [updateHighScore]);

  const surrender = useCallback(() => {
    if (gameState.gameId) {
      if (!simulationMode) {
        emitSurrender(gameState.gameId);
      }
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        showResults: true,
        surrendered: true,
      }));
    }
  }, [gameState.gameId, simulationMode, emitSurrender]);

  const startMatchmaking = useCallback(() => {
    if (simulationMode) {
      setGameState(prev => ({
        ...prev,
        isMatchmaking: true,
        showResults: false,
        surrendered: false,
        opponentScore: undefined,
        opponentClicks: undefined,
        opponentMaxCombo: undefined,
        opponentDisconnected: false,
      }));

      setTimeout(() => {
        setGameState(prev => ({ ...prev, gameId: 'simulation-' + Date.now() }));
        startGame();
      }, SIMULATION_MATCH_DELAY);
    } else {
      findMatch(gameState.gameDuration);
      setGameState(prev => ({
        ...prev,
        isMatchmaking: true,
        showResults: false,
        surrendered: false,
        opponentScore: undefined,
        opponentClicks: undefined,
        opponentMaxCombo: undefined,
        opponentDisconnected: false,
      }));
    }
  }, [simulationMode, findMatch, gameState.gameDuration, startGame]);

  const cancelMatchmaking = useCallback(() => {
    if (simulationMode) {
      setGameState(prev => ({
        ...prev,
        isMatchmaking: false,
        showResults: false,
        opponentScore: undefined,
        opponentClicks: undefined,
        opponentMaxCombo: undefined,
      }));
    } else {
      cancelMatch();
      setGameState(prev => ({
        ...prev,
        isMatchmaking: false,
        showResults: false,
        opponentScore: undefined,
        opponentClicks: undefined,
        opponentMaxCombo: undefined,
      }));
    }
  }, [simulationMode, cancelMatch]);

  const setGameDuration = useCallback((duration: GameDuration) => {
    setGameState(prev => ({
      ...prev,
      gameDuration: duration,
      timeLeft: duration,
    }));
  }, []);

  const closeMatch = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isMatchmaking: false,
      showResults: false,
      opponentScore: undefined,
      opponentClicks: undefined,
      opponentMaxCombo: undefined,
      surrendered: false,
      opponentDisconnected: false,
      gameId: undefined,
    }));
  }, []);

  useEffect(() => {
    if (gameState.isPlaying) {
      const timer = setInterval(() => {
        setGameState(prev => {
          if (prev.countdown !== undefined && prev.countdown > 0) {
            playCountdown();
            return { ...prev, countdown: prev.countdown - 1 };
          }
          
          if (prev.countdown === 0) {
            return { ...prev, countdown: undefined };
          }

          if (prev.timeLeft <= 1) {
            clearInterval(timer);
            return { ...prev, timeLeft: 0, isPlaying: false, showResults: true };
          }

          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.isPlaying, playCountdown]);

  useEffect(() => {
    if (simulationMode && gameState.isPlaying) {
      return simulateOpponentScore();
    }
  }, [simulationMode, gameState.isPlaying, simulateOpponentScore]);

  useEffect(() => {
    if (socket && !simulationMode) {
      socket.on('matchFound', ({ gameId }) => {
        setGameState(prev => ({ ...prev, gameId }));
        startGame();
      });

      socket.on('opponentUpdate', ({ score, clicks, maxCombo }) => {
        setGameState(prev => ({
          ...prev,
          opponentScore: score,
          opponentClicks: clicks,
          opponentMaxCombo: maxCombo,
        }));
      });

      socket.on('opponentSurrendered', () => {
        endGame();
      });

      socket.on('opponentDisconnected', () => {
        setGameState(prev => ({
          ...prev,
          isPlaying: false,
          showResults: true,
          opponentDisconnected: true,
        }));
      });

      return () => {
        socket.off('matchFound');
        socket.off('opponentUpdate');
        socket.off('opponentSurrendered');
        socket.off('opponentDisconnected');
      };
    }
  }, [socket, simulationMode, startGame, endGame]);

  return {
    gameState,
    surrender,
    startMatchmaking,
    cancelMatchmaking,
    handleClick,
    setGameDuration,
    closeMatch,
    simulationMode,
    setSimulationMode
  };
}