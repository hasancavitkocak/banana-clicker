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
import { MatchSettings } from './components/MatchSettings';
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
    setSimulationMode,
    setRegion,
    setSkillLevel
  } = useGameLogic();

  const showBanana = !gameState.showResults || gameState.isPlaying;

  return (
    <GameLayout>
      {/* ... existing code ... */}
      
      <TimeSelector
        onSelectTime={setGameDuration}
        selectedTime={gameState.gameDuration}
        disabled={gameState.isPlaying}
      />

      <MatchSettings
        region={gameState.region}
        skillLevel={gameState.skillLevel}
        onRegionChange={setRegion}
        onSkillLevelChange={setSkillLevel}
        disabled={gameState.isPlaying}
      />

      <GameControls 
        onSurrender={surrender}
        onMatch={startMatchmaking}
        onCancelMatch={cancelMatchmaking}
        isPlaying={gameState.isPlaying}
        isMatchmaking={gameState.isMatchmaking}
      />

      {/* ... rest of the existing code ... */}
    </GameLayout>
  );
}