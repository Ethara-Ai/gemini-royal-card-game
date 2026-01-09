import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Player, Card, RuleSet } from '../lib/types';
import { createDeck, shuffleDeck, getValidMoves, determineTrickWinner } from '../lib/gameLogic';
import { getAIMove } from '../lib/aiLogic';
import { AI_NAMES, CARDS_PER_HAND, AI_DELAY_MIN, AI_DELAY_MAX, TRICK_RESOLUTION_DELAY } from '../lib/constants';
import { toast } from 'sonner';

const createPlayer = (id: string, name: string, type: 'human' | 'ai'): Player => ({
  id,
  name,
  type,
  hand: [],
  score: 0,
  tricksWon: 0,
});

const initialState: GameState = {
  players: [],
  currentTurn: 0,
  dealerIndex: 0,
  phase: 'lobby',
  ruleSet: 'suit-follows',
  currentTrick: [],
  trickLeader: 0,
  winner: null,
  roundNumber: 1,
  deck: [],
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startGame = useCallback((playerName: string, ruleSet: RuleSet) => {
    const human = createPlayer('p1', playerName, 'human');
    const ais = AI_NAMES.map((name, i) => createPlayer(`ai-${i}`, name, 'ai'));
    const players = [human, ...ais];
    
    // Shuffle and Deal
    let deck = shuffleDeck(createDeck());
    
    players.forEach(player => {
      player.hand = deck.slice(0, CARDS_PER_HAND);
      // Sort hand for better UX
      player.hand.sort((a, b) => {
          if (a.suit === b.suit) return a.value - b.value;
          return a.suit.localeCompare(b.suit);
      });
      deck = deck.slice(CARDS_PER_HAND);
    });

    const dealerIndex = Math.floor(Math.random() * 4);
    const firstPlayer = (dealerIndex + 1) % 4;

    setGameState({
      players,
      currentTurn: firstPlayer,
      dealerIndex,
      phase: 'playing', // Skip 'dealing' animation state for logic simplicity, UI handles animation
      ruleSet,
      currentTrick: [],
      trickLeader: firstPlayer,
      winner: null,
      roundNumber: 1,
      deck, // Remaining deck (unused in this game type usually, but kept)
    });
    
    toast.success("Game Started! Good luck.");
  }, []);

  const playCard = useCallback((playerId: string, card: Card) => {
    setGameState(prev => {
      const playerIndex = prev.players.findIndex(p => p.id === playerId);
      if (playerIndex !== prev.currentTurn) return prev;
      if (prev.phase !== 'playing') return prev;

      // Validate
      const validMoves = getValidMoves(prev.players[playerIndex].hand, prev.currentTrick, prev.ruleSet);
      const isValid = validMoves.some(c => c.id === card.id);
      
      if (!isValid && prev.players[playerIndex].type === 'human') {
        toast.error("Invalid move! You must follow suit if possible.");
        return prev;
      }

      // Play
      const newHand = prev.players[playerIndex].hand.filter(c => c.id !== card.id);
      const newTrick = [...prev.currentTrick, { playerId, card, order: prev.currentTrick.length }];
      
      const nextTurn = (prev.currentTurn + 1) % 4;
      const isTrickComplete = newTrick.length === 4;

      const nextPhase = isTrickComplete ? 'trick-resolution' : 'playing';

      const newPlayers = [...prev.players];
      newPlayers[playerIndex] = { ...newPlayers[playerIndex], hand: newHand };

      return {
        ...prev,
        players: newPlayers,
        currentTrick: newTrick,
        currentTurn: nextTurn,
        phase: nextPhase,
      };
    });
  }, []);

  // AI Turn Logic
  useEffect(() => {
    if (gameState.phase === 'playing') {
      const currentPlayer = gameState.players[gameState.currentTurn];
      
      if (currentPlayer.type === 'ai') {
        const delay = Math.random() * (AI_DELAY_MAX - AI_DELAY_MIN) + AI_DELAY_MIN;
        
        timerRef.current = setTimeout(() => {
          const move = getAIMove(currentPlayer.hand, gameState.currentTrick, gameState.ruleSet);
          playCard(currentPlayer.id, move);
        }, delay);
      } else {
        // Human turn - start countdown timer
        // (Implementation of visual timer can be in UI, but auto-play logic could be here)
        // For now, let's strictly handle AI here.
      }
    }
    
    return cleanupTimer;
  }, [gameState.phase, gameState.currentTurn, gameState.players, gameState.ruleSet, gameState.currentTrick, playCard]);

  // Trick Resolution Logic
  useEffect(() => {
    if (gameState.phase === 'trick-resolution') {
      timerRef.current = setTimeout(() => {
        setGameState(prev => {
          const winnerMove = determineTrickWinner(prev.currentTrick, prev.ruleSet);
          const winnerIndex = prev.players.findIndex(p => p.id === winnerMove.playerId);
          const winner = prev.players[winnerIndex];

          const newPlayers = [...prev.players];
          newPlayers[winnerIndex] = { 
            ...winner, 
            score: winner.score + 1, 
            tricksWon: winner.tricksWon + 1 
          };

          toast(`${winner.name} wins the trick!`);

          const handsEmpty = newPlayers[0].hand.length === 0;
          
          if (handsEmpty) {
            // Game Over
            // Find game winner
            const maxScore = Math.max(...newPlayers.map(p => p.score));
            const gameWinners = newPlayers.filter(p => p.score === maxScore);
            // Tie breaking? Joint winners.
            const winnerId = gameWinners[0].id; // Simplified

            return {
              ...prev,
              players: newPlayers,
              currentTrick: [],
              currentTurn: -1,
              phase: 'game-over',
              winner: winnerId,
            };
          } else {
            return {
              ...prev,
              players: newPlayers,
              currentTrick: [],
              currentTurn: winnerIndex, // Winner leads next
              trickLeader: winnerIndex,
              phase: 'playing',
            };
          }
        });
      }, TRICK_RESOLUTION_DELAY);
    }
    return cleanupTimer;
  }, [gameState.phase]);

  return {
    gameState,
    startGame,
    playCard,
    resetGame: () => setGameState(initialState),
  };
};

