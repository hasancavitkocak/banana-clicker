import React from 'react';
import { Users, Loader } from 'lucide-react';

interface MatchmakingStatusProps {
  isSearching: boolean;
  waitTime: number;
}

export function MatchmakingStatus({ isSearching, waitTime }: MatchmakingStatusProps) {
  if (!isSearching) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
        <div className="animate-spin">
          <Loader size={48} className="text-purple-600" />
        </div>
        <div className="flex items-center gap-2">
          <Users size={24} className="text-purple-600" />
          <span className="text-lg font-semibold">Finding Match...</span>
        </div>
        <p className="text-gray-600">Wait time: {waitTime}s</p>
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-600 animate-pulse"
            style={{ width: `${Math.min((waitTime / 30) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}