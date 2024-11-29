import React from 'react';

interface CountdownTimerProps {
  count: number;
}

export function CountdownTimer({ count }: CountdownTimerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="text-8xl font-black text-white animate-bounce"
           style={{ textShadow: '4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000' }}>
        {count || 'GO!'}
      </div>
    </div>
  );
}