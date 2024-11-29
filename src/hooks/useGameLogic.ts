import { useState, useEffect, useCallback } from 'react';
import { GameState, GameDuration, Region, SkillLevel } from '../types/game';
import { useSoundEffects } from './useSoundEffects';
import { useSocket } from './useSocket';

const COMBO_TIMEOUT = 1000; // 1 second
const CLICK_POINTS = 10;
const MAX_COMBO_MULTIPLIER = 5;

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
    region: 'AUTO' as Region,
    skillLevel: 'BEGINNER' as SkillLevel
  });

  const [waitTime, setWaitTime] = useState(0);
  const { playClick, playCombo, playCountdown, playStart } = useSoundEffects();
  const { socket, findMatch, cancelMatch, updateScore, surrender: socketSurrender } = useSocket();

  useEffect(() => {
    if (gameState.isMatchmaking && !gameState.isPlaying) {
      const interval = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setWaitTime(0);
    }
  }, [gameState.isMatchmaking, gameState.isPlaying]);

  useEffect(() => {
    if (socket) {
      socket.on('matchFound', ({ gameId }) => {
        setGameState(prev => ({
          ...prev,
          gameId,
          isPlaying: true,
          countdown: 3,
          score: 0,
          clicks: 0,
          combo: 1,
          maxCombo: 1,
          timeLeft: prev.gameDuration,
          showResults: false,
          surrendered: false,
          opponentDisconnected: false
        }));
        playStart();
      });

      socket.on('opponentUpdate', ({ score, clicks, maxCombo }) => {
        setGameState(prev => ({
          ...prev,
          opponentScore: score,
          opponentClicks: clicks,
          opponentMaxCombo: maxCombo
        }));
      });

      socket.on('opponentSurrendered', () => {
        setGameState(prev => ({
          ...prev,
          isPlaying: false,
          showResults: true,
          opponentDisconnected: false
        }));
      });

      socket.on('opponentDisconnected', () => {
        setGameState(prev => ({
          ...prev,
          isPlaying: false,
          showResults: true,
          opponentDisconnected: true
        }));
      });
    }
  }, [socket, playStart]);

  const handleClick = useCallback(() => {
    if (!gameState.isPlaying) return;

    const now = Date.now();
    const timeSinceLastClick = now - gameState.lastClickTime;
    const newCombo = timeSinceLastClick < COMBO_TIMEOUT ? 
      Math.min(gameState.combo + 1, MAX_COMBO_MULTIPLIER) : 1;
    
    if (newCombo > gameState.combo) {
      playCombo();
    } else {
      playClick();
    }

    const points = CLICK_POINTS * newCombo;
    const newScore = gameState.score + points;
    const newClicks = gameState.clicks + 1;
    const newMaxCombo = Math.max(gameState.maxCombo, newCombo);

    setGameState(prev => ({
      ...prev,
      score: newScore,
      clicks: newClicks,
      combo: newCombo,
      maxCombo: newMaxCombo,
      lastClickTime: now
    }));

    if (gameState.gameId) {
      updateScore({
        gameId: gameState.gameId,
        score: newScore,
        clicks: newClicks,
        maxCombo: newMaxCombo
      });
    }
  }, [gameState, playClick, playCombo, updateScore]);

  const startMatchmaking = useCallback(() => {
    findMatch({
      duration: gameState.gameDuration,
      region: gameState.region,
      skillLevel: gameState.skillLevel
    });
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
  }, [findMatch, gameState.gameDuration, gameState.region, gameState.skillLevel]);

  const cancelMatchmaking = useCallback(() => {
    cancelMatch();
    setGameState(prev => ({
      ...prev,
      isMatchmaking: false
    }));
  }, [cancelMatch]);

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

  const closeMatch = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showResults: false,
      isMatchmaking: false
    }));
  }, []);

  useEffect(() => {
    if (gameState.countdown) {
      playCountdown();
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          countdown: prev.countdown && prev.countdown > 1 ? prev.countdown - 1 : undefined
        }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.countdown, playCountdown]);

  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft === 0) {
            const newHighScore = Math.max(prev.highScore, prev.score);
            localStorage.setItem('highScore', newHighScore.toString());
            return {
              ...prev,
              timeLeft: newTimeLeft,
              isPlaying: false,
              showResults: true,
              highScore: newHighScore
            };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.isPlaying, gameState.timeLeft]);

  return {
    gameState,
    surrender,
    startMatchmaking,
    cancelMatchmaking,
    handleClick,
    setGameDuration: (duration: GameDuration) => 
      setGameState(prev => ({ ...prev, gameDuration: duration })),
    closeMatch,
    setRegion: (region: Region) => 
      setGameState(prev => ({ ...prev, region })),
    setSkillLevel: (skillLevel: SkillLevel) => 
      setGameState(prev => ({ ...prev, skillLevel })),
    waitTime
  };
}