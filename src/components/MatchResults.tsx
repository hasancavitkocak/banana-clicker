import React, { useEffect } from 'react';
import { Trophy, Medal, Crown, Undo, X, Flag, UserX } from 'lucide-react';
import type { GameResult } from '../types/game';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface MatchResultsProps {
  result: GameResult;
  onRematch: () => void;
  onClose: () => void;
  surrendered?: boolean;
  opponentDisconnected?: boolean;
}

export function MatchResults({ result, onRematch, onClose, surrendered, opponentDisconnected }: MatchResultsProps) {
  const playerWon = result.playerScore > result.opponentScore;
  const isDraw = result.playerScore === result.opponentScore;
  const { playWin, playLose } = useSoundEffects();

  useEffect(() => {
    if (playerWon && !surrendered && !opponentDisconnected) {
      playWin();
    } else if (!isDraw) {
      playLose();
    }
  }, [playerWon, isDraw, surrendered, opponentDisconnected, playWin, playLose]);

  useEffect(() => {
    if (opponentDisconnected) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [opponentDisconnected, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 md:p-8 w-full max-w-md mx-auto shadow-xl relative overflow-hidden">
        {playerWon && !surrendered && !opponentDisconnected && (
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-500 rotate-45 transform origin-bottom-left" />
        )}
        
        <div className="text-center mb-6">
          {opponentDisconnected ? (
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <UserX size={48} className="text-red-500" />
              <span className="text-red-500">Opponent Left</span>
              <span className="text-sm text-gray-500">The match has ended</span>
              <span className="text-xs text-gray-400 mt-2">Closing in 3 seconds...</span>
            </div>
          ) : surrendered ? (
            <div className="flex flex-col items-center gap-2">
              <Flag size={48} className="text-red-500" />
              <span className="text-red-500">Surrendered!</span>
              <span className="text-sm text-gray-500">You gave up the match</span>
            </div>
          ) : playerWon ? (
            <div className="flex flex-col items-center gap-2">
              <Crown size={48} className="text-yellow-500 animate-bounce" />
              <span className="text-yellow-500 text-4xl font-black" 
                    style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}>
                WIN!
              </span>
            </div>
          ) : isDraw ? (
            <span className="text-4xl font-black">It's a Draw!</span>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl font-black text-red-500 animate-pulse">Defeat</span>
              <span className="text-sm text-gray-500">Better luck next time!</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className={`text-center p-4 rounded-lg transition-colors ${
              playerWon && !surrendered && !opponentDisconnected ? 'bg-yellow-100 ring-2 ring-yellow-400' : 
              !isDraw ? 'bg-red-50 text-red-800' : ''
            }`}>
              <h3 className="font-semibold text-lg mb-2">You</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-1 justify-center">
                  <Trophy size={16} className={playerWon && !surrendered && !opponentDisconnected ? 'text-yellow-600' : 'text-gray-400'} />
                  <span>{result.playerScore}</span>
                </p>
                <p>{result.playerClicks} clicks</p>
                <p>Max: {result.playerMaxCombo}x</p>
              </div>
            </div>

            <div className={`text-center p-4 rounded-lg transition-colors ${
              !playerWon || surrendered ? 'bg-purple-100 ring-2 ring-purple-400' : 
              playerWon ? 'bg-red-50 text-red-800' : ''
            }`}>
              <h3 className="font-semibold text-lg mb-2">Opponent</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-1 justify-center">
                  <Trophy size={16} className={!playerWon || surrendered ? 'text-purple-600' : 'text-gray-400'} />
                  <span>{result.opponentScore}</span>
                </p>
                <p>{result.opponentClicks} clicks</p>
                <p>Max: {result.opponentMaxCombo}x</p>
              </div>
            </div>
          </div>

          {(playerWon && !surrendered && !opponentDisconnected) && (
            <div className="flex items-center justify-center gap-2 text-yellow-600 bg-yellow-100 p-3 rounded-lg">
              <Medal size={24} />
              <span className="font-bold text-lg">Champion!</span>
            </div>
          )}

          {!opponentDisconnected && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={onRematch}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full
                  flex items-center justify-center gap-2 transform transition-all
                  hover:scale-105 active:scale-95 focus:outline-none shadow-lg"
              >
                <Undo size={16} />
                <span>Rematch</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full
                  flex items-center justify-center gap-2 transform transition-all
                  hover:scale-105 active:scale-95 focus:outline-none shadow-lg"
              >
                <X size={16} />
                <span>Close</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}