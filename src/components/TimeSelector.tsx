import React from 'react';
import { Clock } from 'lucide-react';
import type { GameDuration } from '../types/game';

interface TimeSelectorProps {
  onSelectTime: (duration: GameDuration) => void;
  selectedTime: GameDuration;
  disabled: boolean;
}

export function TimeSelector({
  onSelectTime,
  selectedTime,
  disabled,
}: TimeSelectorProps) {
  const durations: GameDuration[] = [5, 10, 15, 20];

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="flex items-center gap-2">
        <Clock size={20} className="text-yellow-600" />
        <span className="font-semibold text-yellow-800">Select Time</span>
      </div>
      <div className="flex gap-2">
        {durations.map((duration) => (
          <button
            key={duration}
            onClick={() => onSelectTime(duration)}
            disabled={disabled}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
                selectedTime === duration
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {duration}s
          </button>
        ))}
      </div>
      <p className="text-sm text-yellow-600 mt-1 text-center">
        You'll be matched with players who selected the same duration
      </p>
    </div>
  );
}
