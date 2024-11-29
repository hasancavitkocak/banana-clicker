import React from 'react';

interface BananaCounterProps {
  count: number;
}

export function BananaCounter({ count }: BananaCounterProps) {
  return (
    <div className="text-center mt-8">
      <p className="text-4xl font-bold text-yellow-800">
        {count} {count === 1 ? 'Click' : 'Clicks'}
      </p>
    </div>
  );
}