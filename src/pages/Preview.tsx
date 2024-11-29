import React, { useState } from 'react';
import { BananaButton } from '../components/BananaButton';
import { GameTimer } from '../components/GameTimer';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { GameControls } from '../components/GameControls';
import { TimeSelector } from '../components/TimeSelector';
import { HighScore } from '../components/HighScore';
import { OpponentScore } from '../components/OpponentScore';
import { MatchResults } from '../components/MatchResults';
import { CountdownTimer } from '../components/CountdownTimer';
import { Layout } from 'lucide-react';

export function Preview() {
  const [activePreview, setActivePreview] = useState<string>('all');

  const mockGameResult = {
    playerScore: 1500,
    playerClicks: 150,
    playerMaxCombo: 10,
    opponentScore: 1200,
    opponentClicks: 140,
    opponentMaxCombo: 8,
  };

  const PreviewSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="border rounded-lg p-4 mb-4 bg-white">
      <h2 className="text-lg font-bold mb-2 text-yellow-800">{title}</h2>
      <div className="bg-yellow-50 p-4 rounded-lg">
        {children}
      </div>
    </div>
  );

  const PreviewButton = ({ id, label }: { id: string, label: string }) => (
    <button
      onClick={() => setActivePreview(id)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all
        ${activePreview === id
          ? 'bg-yellow-500 text-white'
          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Layout className="text-yellow-600" size={24} />
          <h1 className="text-2xl font-bold text-yellow-800">Component Preview</h1>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <PreviewButton id="all" label="All Components" />
          <PreviewButton id="game" label="Game Elements" />
          <PreviewButton id="ui" label="UI Components" />
          <PreviewButton id="modals" label="Modals & Overlays" />
        </div>

        {(activePreview === 'all' || activePreview === 'game') && (
          <>
            <PreviewSection title="Banana Button">
              <div className="flex gap-4">
                <BananaButton onClick={() => {}} isPlaying={true} />
                <BananaButton onClick={() => {}} isPlaying={true} isWinning={true} />
                <BananaButton onClick={() => {}} isPlaying={false} />
              </div>
            </PreviewSection>

            <PreviewSection title="Score Display">
              <div className="flex gap-4">
                <ScoreDisplay score={1500} combo={1} maxCombo={10} />
                <ScoreDisplay score={2000} combo={5} maxCombo={15} />
              </div>
            </PreviewSection>
          </>
        )}

        {(activePreview === 'all' || activePreview === 'ui') && (
          <>
            <PreviewSection title="Game Timer">
              <div className="relative h-20">
                <GameTimer timeLeft={30} isPlaying={true} />
              </div>
            </PreviewSection>

            <PreviewSection title="Time Selector">
              <TimeSelector
                onSelectTime={() => {}}
                selectedTime={10}
                disabled={false}
              />
            </PreviewSection>

            <PreviewSection title="Game Controls">
              <div className="flex gap-4">
                <GameControls
                  onSurrender={() => {}}
                  onMatch={() => {}}
                  onCancelMatch={() => {}}
                  isPlaying={false}
                  isMatchmaking={false}
                />
                <GameControls
                  onSurrender={() => {}}
                  onMatch={() => {}}
                  onCancelMatch={() => {}}
                  isPlaying={true}
                  isMatchmaking={true}
                />
              </div>
            </PreviewSection>

            <PreviewSection title="Opponent Score">
              <OpponentScore score={1200} clicks={120} maxCombo={8} />
            </PreviewSection>
          </>
        )}

        {(activePreview === 'all' || activePreview === 'modals') && (
          <>
            <PreviewSection title="Match Results">
              <div className="relative h-[600px] bg-gray-100">
                <MatchResults
                  result={mockGameResult}
                  onRematch={() => {}}
                  onClose={() => {}}
                  surrendered={false}
                />
              </div>
            </PreviewSection>

            <PreviewSection title="Countdown Timer">
              <div className="relative h-[200px] bg-gray-100">
                <CountdownTimer count={3} />
              </div>
            </PreviewSection>

            <PreviewSection title="High Score">
              <div className="relative h-[200px]">
                <HighScore highScore={2500} />
              </div>
            </PreviewSection>
          </>
        )}
      </div>
    </div>
  );
}