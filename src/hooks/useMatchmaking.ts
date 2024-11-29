import { useState, useEffect, useCallback } from 'react';
import { Region, SkillLevel, GameDuration } from '../types/game';
import { Socket } from 'socket.io-client';

export function useMatchmaking(socket: Socket | null) {
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    if (isMatchmaking) {
      const interval = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setWaitTime(0);
    }
  }, [isMatchmaking]);

  const startMatchmaking = useCallback((params: {
    duration: GameDuration;
    region: Region;
    skillLevel: SkillLevel;
  }) => {
    if (socket) {
      socket.emit('findMatch', params);
      setIsMatchmaking(true);
    }
  }, [socket]);

  const cancelMatchmaking = useCallback(() => {
    if (socket) {
      socket.emit('cancelMatch');
      setIsMatchmaking(false);
    }
  }, [socket]);

  return {
    isMatchmaking,
    waitTime,
    startMatchmaking,
    cancelMatchmaking
  };
}