import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ResetButtonProps {
  onReset: () => void;
}

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button
      onClick={onReset}
      className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full
        flex items-center justify-center gap-2 transform transition-all
        hover:scale-105 active:scale-95 focus:outline-none"
    >
      <RotateCcw size={16} />
      <span>Reset Count</span>
    </button>
  );
}