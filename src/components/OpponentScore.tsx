import React from 'react';
import { Trophy } from 'lucide-react';

interface OpponentScoreProps {
  score?: number;
  clicks?: number;
  maxCombo?: number;
}

export function OpponentScore({ score, clicks, maxCombo }: OpponentScoreProps) {
  if (score === undefined || clicks === undefined) return null;

  return (
    <div className="flex items-center gap-4 bg-purple-100 px-4 py-2 rounded-lg shadow-md w-full max-w-md mx-auto mb-4">
      <div className="flex items-center gap-2">
        <Trophy size={20} className="text-purple-600" />
        <span className="font-bold text-purple-800">Opponent</span>
      </div>
      <div className="flex gap-4 ml-auto">
        <div className="text-purple-800">Score: {score}</div>
        <div className="text-purple-800">Clicks: {clicks}</div>
        <div className="text-purple-800">Max: {maxCombo}x</div>
      </div>
    </div>
  );
}