import { describe, it, expect } from 'vitest';
import { createDeck, determineTrickWinner, getValidMoves } from './gameLogic';
import { Card, PlayedCard } from './types';

const createCard = (suit: any, rank: any, value: number): Card => ({
  id: `${rank}-${suit}`,
  suit,
  rank,
  value
});

describe('Game Logic', () => {
  describe('createDeck', () => {
    it('should create 52 cards', () => {
      const deck = createDeck();
      expect(deck).toHaveLength(52);
    });
  });

  describe('determineTrickWinner', () => {
    const c7H = createCard('hearts', '7', 7);
    const c10H = createCard('hearts', '10', 10);
    const c2D = createCard('diamonds', '2', 2); // Off suit
    const cAS = createCard('spades', 'A', 14);

    it('Suit Follows: Highest of led suit wins', () => {
      const trick: PlayedCard[] = [
        { playerId: 'p1', card: c7H, order: 0 }, // Led hearts
        { playerId: 'p2', card: c10H, order: 1 }, // Followed hearts (higher)
        { playerId: 'p3', card: c2D, order: 2 }, // Played diamonds (ignore)
        { playerId: 'p4', card: cAS, order: 3 }, // Played spades (ignore in this mode)
      ];
      
      const winner = determineTrickWinner(trick, 'suit-follows');
      expect(winner.playerId).toBe('p2');
    });

    it('Highest Card: Highest value wins regardless of suit', () => {
      const trick: PlayedCard[] = [
        { playerId: 'p1', card: c7H, order: 0 },
        { playerId: 'p2', card: c10H, order: 1 },
        { playerId: 'p3', card: c2D, order: 2 },
        { playerId: 'p4', card: cAS, order: 3 }, // Ace is highest value
      ];
      
      const winner = determineTrickWinner(trick, 'highest-card');
      expect(winner.playerId).toBe('p4');
    });

    it('Spades Trump: Spades beat other suits', () => {
      const c2S = createCard('spades', '2', 2);
      
      const trick: PlayedCard[] = [
        { playerId: 'p1', card: c10H, order: 0 }, // Led hearts
        { playerId: 'p2', card: cAS, order: 1 }, // Spades Ace
        { playerId: 'p3', card: c2S, order: 2 }, // Spades 2
        { playerId: 'p4', card: c7H, order: 3 },
      ];
      
      // Highest spade wins
      const winner = determineTrickWinner(trick, 'spades-trump');
      expect(winner.playerId).toBe('p2');
    });

    it('Spades Trump: Lowest spade beats highest heart', () => {
        const c2S = createCard('spades', '2', 2);
        
        const trick: PlayedCard[] = [
          { playerId: 'p1', card: c10H, order: 0 }, // Led hearts
          { playerId: 'p2', card: c7H, order: 1 }, 
          { playerId: 'p3', card: c2S, order: 2 }, // Spades 2 (Trump)
          { playerId: 'p4', card: c2D, order: 3 },
        ];
        
        const winner = determineTrickWinner(trick, 'spades-trump');
        expect(winner.playerId).toBe('p3');
      });
  });

  describe('getValidMoves', () => {
    const hand = [
        createCard('hearts', '7', 7),
        createCard('diamonds', '10', 10),
    ];

    it('should allow any card if leading', () => {
        const moves = getValidMoves(hand, [], 'suit-follows');
        expect(moves).toHaveLength(2);
    });

    it('should force suit follow if possible', () => {
        const trick = [{ playerId: 'p2', card: createCard('hearts', '2', 2), order: 0 }];
        const moves = getValidMoves(hand, trick, 'suit-follows');
        expect(moves).toHaveLength(1);
        expect(moves[0].suit).toBe('hearts');
    });

    it('should allow any card if void in led suit', () => {
        const trick = [{ playerId: 'p2', card: createCard('clubs', '2', 2), order: 0 }];
        const moves = getValidMoves(hand, trick, 'suit-follows');
        expect(moves).toHaveLength(2);
    });
  });
});

