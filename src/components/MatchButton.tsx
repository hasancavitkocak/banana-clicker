import React from 'react';
import { Users, X } from 'lucide-react';

interface MatchButtonProps {
  onMatch: () => void;
  onCancel: () => void;
  isMatchmaking: boolean;
  disabled: boolean;
}

export function MatchButton({ onMatch, onCancel, isMatchmaking, disabled }: MatchButtonProps) {
  if (isMatchmaking) {
    return (
      <button
        onClick={onCancel}
        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full
          flex items-center justify-center gap-2 transform transition-all
          hover:scale-105 active:scale-95 focus:outline-none shadow-lg
          animate-pulse"
      >
        <X size={16} />
        <span>Cancel Search</span>
      </button>
    );
  }

  return (
    <button
      onClick={onMatch}
      disabled={disabled}
      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full
        flex items-center justify-center gap-2 transform transition-all
        hover:scale-105 active:scale-95 focus:outline-none shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Users size={16} />
      <span>Find Match</span>
    </button>
  );
}