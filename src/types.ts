
export interface Player {
  id: number;
  name: string;
  position: number; // 0 to 12
  color: string;
  score: number;
}

export interface SquareData {
  id: number;
  word: string;
  icon: string;
  plural: string;
  ruleSuffix: 's' | 'es';
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  status: 'idle' | 'rolling' | 'moving' | 'answering' | 'finished';
  lastRoll: number | null;
  currentSquare: SquareData | null;
  rounds: RoundRecord[];
  isChallengeMode: boolean;
}

export interface RoundRecord {
  round: number;
  player1Word: string;
  player1Correct: boolean | null;
  player2Word: string;
  player2Correct: boolean | null;
}
