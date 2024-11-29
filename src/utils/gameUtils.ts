import { GameState } from '../types/game';

export const COMBO_TIMEOUT = 1000;
export const CLICK_POINTS = 10;
export const MAX_COMBO_MULTIPLIER = 5;

export function calculateNewScore(currentState: GameState, clickTime: number) {
  const timeSinceLastClick = clickTime - currentState.lastClickTime;
  const newCombo = timeSinceLastClick < COMBO_TIMEOUT ? 
    Math.min(currentState.combo + 1, MAX_COMBO_MULTIPLIER) : 1;
  
  const points = CLICK_POINTS * newCombo;
  const newScore = currentState.score + points;
  const newClicks = currentState.clicks + 1;
  const newMaxCombo = Math.max(currentState.maxCombo, newCombo);

  return {
    score: newScore,
    clicks: newClicks,
    combo: newCombo,
    maxCombo: newMaxCombo,
    lastClickTime: clickTime
  };
}

export function updateHighScore(currentScore: number, previousHighScore: number): number {
  const newHighScore = Math.max(previousHighScore, currentScore);
  localStorage.setItem('highScore', newHighScore.toString());
  return newHighScore;
}