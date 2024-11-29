import React, { useState } from 'react';
import { BananaButton } from './components/BananaButton';
import { GameTimer } from './components/GameTimer';
import { ScoreDisplay } from './components/ScoreDisplay';
import { GameControls } from './components/GameControls';
import { TimeSelector } from './components/TimeSelector';
import { HighScore } from './components/HighScore';
import { OpponentScore } from './components/OpponentScore';
import { MatchResults } from './components/MatchResults';
import { CountdownTimer } from './components/CountdownTimer';
import { useGameLogic } from './hooks/useGameLogic';
import { GameLayout } from './components/GameLayout';
import { GameHeader } from './components/GameHeader';
import { Zap } from 'lucide-react';

export default function App() {
  const { 
    gameState, 
    surrender,
    startMatchmaking,
    cancelMatchmaking,
    handleClick, 
    setGameDuration,
    closeMatch,
    simulationMode,
    setSimulationMode
  } = useGameLogic();

  const showBanana = !gameState.showResults || gameState.isPlaying;

  return (
    <GameLayout>
      <div className="fixed top-4 right-4">
        <button
          onClick={() => setSimulationMode(!simulationMode)}
          className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors
            ${simulationMode ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          <Zap size={16} />
          <span>Simulation {simulationMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        <GameHeader />
        
        <div className="w-full space-y-4">
          <OpponentScore 
            score={gameState.opponentScore} 
            clicks={gameState.opponentClicks}
            maxCombo={gameState.opponentMaxCombo}
          />
          
          <div className="flex justify-center">
            <GameTimer timeLeft={gameState.timeLeft} isPlaying={gameState.isPlaying} />
          </div>
        </div>
        
        <ScoreDisplay score={gameState.score} combo={gameState.combo} maxCombo={gameState.maxCombo} />
        
        {showBanana && (
          <BananaButton 
            onClick={handleClick}
            isPlaying={gameState.isPlaying}
            isWinning={gameState.score > (gameState.opponentScore || 0)}
            showWinEffect={!gameState.isPlaying && gameState.showResults}
          />
        )}
        
        <div className="text-lg text-yellow-700 text-center mt-4">
          {gameState.clicks} {gameState.clicks === 1 ? 'Click' : 'Clicks'}
        </div>

        <TimeSelector
          onSelectTime={setGameDuration}
          selectedTime={gameState.gameDuration}
          disabled={gameState.isPlaying}
        />

        <GameControls 
          onSurrender={surrender}
          onMatch={startMatchmaking}
          onCancelMatch={cancelMatchmaking}
          isPlaying={gameState.isPlaying}
          isMatchmaking={gameState.isMatchmaking}
        />
      </div>

      <HighScore highScore={gameState.highScore} />

      {gameState.showResults && !gameState.isPlaying && (
        <MatchResults
          result={{
            playerScore: gameState.score,
            playerClicks: gameState.clicks,
            playerMaxCombo: gameState.maxCombo,
            opponentScore: gameState.opponentScore || 0,
            opponentClicks: gameState.opponentClicks || 0,
            opponentMaxCombo: gameState.opponentMaxCombo || 1,
          }}
          onRematch={startMatchmaking}
          onClose={closeMatch}
          surrendered={gameState.surrendered}
          opponentDisconnected={gameState.opponentDisconnected}
        />
      )}

      {gameState.countdown !== undefined && (
        <CountdownTimer count={gameState.countdown} />
      )}
    </GameLayout>
  );
}