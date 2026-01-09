import { Rank, Suit } from './types';

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const AI_NAMES = ['Alex', 'Sam', 'Jordan'];

export const TRICKS_PER_GAME = 7;
export const CARDS_PER_HAND = 7;

export const TURN_TIMEOUT = 30; // Seconds for human turn
export const AI_DELAY_MIN = 1000; // ms
export const AI_DELAY_MAX = 2500; // ms
export const TRICK_RESOLUTION_DELAY = 2000; // ms
export const DEAL_ANIMATION_DURATION = 500; // ms

// Numerical values for ranks
export const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

export const CARD_BACK_PATTERNS = [
  'solid',
  'checkerboard',
  'diagonal-stripes',
  'polka-dots'
];

