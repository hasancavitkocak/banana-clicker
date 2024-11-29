import { useState, useEffect } from 'react';

export function useGameTimer(
  isPlaying: boolean,
  initialTime: number,
  onTimeUp: () => void
) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        if (timeLeft === 1) {
          onTimeUp();
        }
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, timeLeft, onTimeUp]);

  const resetTimer = (newTime: number) => {
    setTimeLeft(newTime);
  };

  return {
    timeLeft,
    resetTimer
  };
}