export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number; // Numerical value for comparison
}

export type PlayerType = 'human' | 'ai';

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  hand: Card[];
  score: number;
  tricksWon: number;
  avatar?: string; // Optional avatar URL or identifier
}

export type GamePhase = 
  | 'lobby' 
  | 'dealing' 
  | 'playing' 
  | 'trick-resolution' 
  | 'game-over';

export type RuleSet = 'suit-follows' | 'highest-card' | 'spades-trump';

export interface PlayedCard {
  playerId: string;
  card: Card;
  order: number; // 0-3, order in the trick
}

export interface GameState {
  players: Player[];
  currentTurn: number; // Index of player whose turn it is
  dealerIndex: number;
  phase: GamePhase;
  ruleSet: RuleSet;
  currentTrick: PlayedCard[];
  trickLeader: number; // Index of player who led the trick
  winner: string | null; // Player ID of winner
  roundNumber: number; // 1-7
  deck: Card[];
}

export interface Theme {
  name: 'dark' | 'light';
  cardBack: string; // Color or pattern ID
}

