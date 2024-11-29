import { useState, useEffect } from 'react';

export function useCountdown(
  initialCount: number | undefined,
  onComplete?: () => void,
  onTick?: () => void
) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count) {
      onTick?.();
      const timer = setTimeout(() => {
        if (count > 1) {
          setCount(count - 1);
        } else {
          setCount(undefined);
          onComplete?.();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete, onTick]);

  return count;
}