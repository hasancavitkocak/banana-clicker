export interface GameState {
  score: number;
  clicks: number;
  timeLeft: number;
  isPlaying: boolean;
  combo: number;
  maxCombo: number;
  lastClickTime: number;
  highScore: number;
  gameDuration: number;
  isMatchmaking: boolean;
  opponentScore?: number;
  opponentClicks?: number;
  opponentMaxCombo?: number;
  showResults: boolean;
  countdown?: number;
  surrendered: boolean;
  gameId?: string;
  opponentDisconnected: boolean;
}

export interface GameStats {
  score: number;
  clicks: number;
  combo: number;
}

export interface GameResult {
  playerScore: number;
  playerClicks: number;
  playerMaxCombo: number;
  opponentScore: number;
  opponentClicks: number;
  opponentMaxCombo: number;
}

export type GameDuration = 5 | 10 | 15 | 20;