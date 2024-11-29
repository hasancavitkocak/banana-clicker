import React from 'react';
import { Trophy } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  combo: number;
  maxCombo: number;
}

export function ScoreDisplay({ score, combo, maxCombo }: ScoreDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <div className="flex items-center gap-2">
        <Trophy size={24} className="text-yellow-600" />
        <span className="text-3xl font-bold text-yellow-800">{score}</span>
      </div>
      <div className="flex gap-2">
        {combo > 1 && (
          <div className="animate-bounce">
            <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-bold">
              {combo}x Combo!
            </span>
          </div>
        )}
        <span className="text-sm text-yellow-600">
          Max Combo: {maxCombo}x
        </span>
      </div>
    </div>
  );
}