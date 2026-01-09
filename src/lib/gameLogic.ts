import { Card, PlayedCard, RuleSet } from './types';
import { SUITS, RANKS, RANK_VALUES } from './constants';

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({
        id: `${rank}-${suit}`,
        suit,
        rank,
        value: RANK_VALUES[rank],
      });
    });
  });
  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const getValidMoves = (hand: Card[], currentTrick: PlayedCard[], ruleSet: RuleSet): Card[] => {
  if (currentTrick.length === 0) {
    return hand; // Can lead with anything
  }

  const ledSuit = currentTrick[0].card.suit;
  const hasLedSuit = hand.some((card) => card.suit === ledSuit);

  if (ruleSet === 'suit-follows' || ruleSet === 'spades-trump') {
    if (hasLedSuit) {
      return hand.filter((card) => card.suit === ledSuit);
    }
  }

  // If highest-card or if player doesn't have led suit, they can play anything
  return hand;
};

export const determineTrickWinner = (trick: PlayedCard[], ruleSet: RuleSet): PlayedCard => {
  if (trick.length === 0) throw new Error("Empty trick");

  const ledCard = trick[0];
  const ledSuit = ledCard.card.suit;

  switch (ruleSet) {
    case 'highest-card':
      // Sort by value descending. If values equal, the earlier played card wins (stable sort behavior or manual check)
      // We want strictly highest value.
      // Tie-breaker: First one played wins.
      let highest = trick[0];
      for (let i = 1; i < trick.length; i++) {
        if (trick[i].card.value > highest.card.value) {
          highest = trick[i];
        }
      }
      return highest;

    case 'suit-follows':
      // Winner is highest card of the LED SUIT.
      // Cards of other suits are ignored (value 0 effectively).
      let currentBest = trick[0];
      for (let i = 1; i < trick.length; i++) {
        const p = trick[i];
        if (p.card.suit === ledSuit) {
          if (p.card.value > currentBest.card.value) {
            currentBest = p;
          }
        }
      }
      return currentBest;

    case 'spades-trump':
      // If any spade is played, highest spade wins.
      // If no spades, highest card of led suit wins.
      const spades = trick.filter((p) => p.card.suit === 'spades');
      
      if (spades.length > 0) {
        // Find highest spade
        let bestSpade = spades[0];
        for (let i = 1; i < spades.length; i++) {
          if (spades[i].card.value > bestSpade.card.value) {
            bestSpade = spades[i];
          }
        }
        return bestSpade;
      } else {
        // No spades, standard suit follow logic
        let currentBest = trick[0];
        for (let i = 1; i < trick.length; i++) {
          const p = trick[i];
          if (p.card.suit === ledSuit) {
            if (p.card.value > currentBest.card.value) {
              currentBest = p;
            }
          }
        }
        return currentBest;
      }
  }
};

