import { Card, PlayedCard, RuleSet } from './types';
import { getValidMoves, determineTrickWinner } from './gameLogic';

export const getAIMove = (
  hand: Card[],
  currentTrick: PlayedCard[],
  ruleSet: RuleSet,
  // playedCards could be added later for memory
): Card => {
  const validMoves = getValidMoves(hand, currentTrick, ruleSet);

  if (validMoves.length === 0) {
    // Should not happen if logic is correct
    return hand[0]; 
  }
  if (validMoves.length === 1) {
    return validMoves[0];
  }

  // Strategy
  
  // 1. If leading the trick
  if (currentTrick.length === 0) {
    // Simple strategy: Play highest card to try and secure a trick
    // Or play lowest if we want to save high cards? 
    // Let's go with: Play highest card of our longest suit (or just highest value)
    return validMoves.reduce((prev, curr) => (curr.value > prev.value ? curr : prev));
  }

  // 2. If following
  // Calculate who is currently winning the trick
  // const currentWinner = determineTrickWinner(currentTrick, ruleSet);
  // const winningValue = currentWinner.card.value; 

  // Filter moves that can win the trick
  const winningMoves = validMoves.filter(move => {
    // Simulate playing this card
    const simulatedTrick = [...currentTrick, { playerId: 'me', card: move, order: currentTrick.length }];
    const winner = determineTrickWinner(simulatedTrick, ruleSet);
    return winner.card === move;
  });

  if (winningMoves.length > 0) {
    // We can win! Play the lowest card that wins (save higher ones)
    winningMoves.sort((a, b) => a.value - b.value);
    return winningMoves[0];
  } else {
    // We can't win. Dump the lowest card to save value for later.
    // If spades-trump, maybe dump a low spade if we are forced?
    // Actually getValidMoves handles 'forced'.
    // Just sort by value and pick lowest.
    validMoves.sort((a, b) => a.value - b.value);
    return validMoves[0];
  }
};

