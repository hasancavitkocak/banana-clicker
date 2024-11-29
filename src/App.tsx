import React from 'react';
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

export default function App() {
  const { 
    gameState, 
    surrender,
    startMatchmaking,
    cancelMatchmaking,
    handleClick, 
    setGameDuration,
    closeMatch
  } = useGameLogic();

  const showBanana = !gameState.showResults || gameState.isPlaying;

  return (
    <GameLayout>
      <GameHeader />
      
      {gameState.countdown && (
        <CountdownTimer count={gameState.countdown} />
      )}

      {showBanana && (
        <>
          <GameTimer 
            timeLeft={gameState.timeLeft} 
            isPlaying={gameState.isPlaying} 
          />

          <ScoreDisplay 
            score={gameState.score}
            combo={gameState.combo}
            maxCombo={gameState.maxCombo}
          />

          {gameState.opponentScore !== undefined && (
            <OpponentScore 
              score={gameState.opponentScore}
              clicks={gameState.opponentClicks}
              maxCombo={gameState.opponentMaxCombo}
            />
          )}

          <BananaButton
            onClick={handleClick}
            isPlaying={gameState.isPlaying}
            isWinning={gameState.opponentScore !== undefined && gameState.score > gameState.opponentScore}
          />
        </>
      )}

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

      {gameState.showResults && (
        <MatchResults
          result={{
            playerScore: gameState.score,
            playerClicks: gameState.clicks,
            playerMaxCombo: gameState.maxCombo,
            opponentScore: gameState.opponentScore || 0,
            opponentClicks: gameState.opponentClicks || 0,
            opponentMaxCombo: gameState.opponentMaxCombo || 0
          }}
          onRematch={startMatchmaking}
          onClose={closeMatch}
          surrendered={gameState.surrendered}
          opponentDisconnected={gameState.opponentDisconnected}
        />
      )}

      <HighScore highScore={gameState.highScore} />
    </GameLayout>
  );
}