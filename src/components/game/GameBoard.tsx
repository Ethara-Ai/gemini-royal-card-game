import React, { useState, useEffect } from 'react';
import { GameState, Card } from '../../lib/types';
import { PlayerAvatar } from './PlayerAvatar';
import { Table } from './Table';
import { Hand } from './Hand';
import { TurnTimer } from './TurnTimer';
import { getValidMoves } from '../../lib/gameLogic';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { SettingsMenu } from './SettingsMenu';

interface GameBoardProps {
  gameState: GameState;
  onPlayCard: (card: Card) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, onPlayCard }) => {
  const { players, currentTurn, currentTrick, winner, phase } = gameState;
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Identify players
  const human = players.find(p => p.type === 'human')!;
  const playerIndex = players.indexOf(human);
  
  // Rotate players so human is at bottom (index 0 for layout purposes)
  const getRelativePlayer = (offset: number) => {
    return players[(playerIndex + offset) % 4];
  };

  const leftAI = getRelativePlayer(1);
  const topAI = getRelativePlayer(2);
  const rightAI = getRelativePlayer(3);

  const isHumanTurn = currentTurn === playerIndex && phase === 'playing';
  const validMoves = isHumanTurn ? getValidMoves(human.hand, currentTrick, gameState.ruleSet) : [];

  const handleCardClick = (card: Card) => {
    if (!isHumanTurn) return;
    
    if (validMoves.some(c => c.id === card.id)) {
      if (selectedCardId === card.id) {
        setSelectedCardId(null); // Deselect
      } else {
        setSelectedCardId(card.id);
        // Optional: Auto-play on second tap? Prompt says "tap card to select, tap table to play"
      }
    } else {
      toast.error("You can't play that card!");
    }
  };

  const handleTableClick = () => {
    if (isHumanTurn && selectedCardId) {
      const card = human.hand.find(c => c.id === selectedCardId);
      if (card) {
        onPlayCard(card);
        setSelectedCardId(null);
      }
    } else if (isHumanTurn && !selectedCardId) {
      toast.info("Select a card first!");
    }
  };

  // Auto-deselect if turn ends
  useEffect(() => {
    if (!isHumanTurn) setSelectedCardId(null);
  }, [isHumanTurn]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 overflow-hidden bg-casino-darkGreen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-casino-felt to-casino-darkGreen">
       {/* Background pattern */}
       <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/poker-chip.png')] bg-repeat" />
       
       <SettingsMenu />

      {/* Top AI */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <PlayerAvatar player={topAI} isCurrentTurn={players.indexOf(topAI) === currentTurn} position="top" />
        <div className="mt-2 flex justify-center -space-x-8">
           {/* Show card backs for AI hand */}
           {topAI.hand.map((_, i) => (
             <div key={i} className="w-8 h-12 bg-blue-900 rounded border border-white/20" />
           ))}
        </div>
      </div>

      {/* Middle Row */}
      <div className="flex-1 flex items-center justify-between w-full max-w-6xl mx-auto relative">
        {/* Left AI */}
        <div className="flex flex-col items-center gap-2">
           <PlayerAvatar player={leftAI} isCurrentTurn={players.indexOf(leftAI) === currentTurn} position="left" />
           <div className="flex flex-col -space-y-8 mt-4">
             {leftAI.hand.map((_, i) => (
               <div key={i} className="w-12 h-8 bg-blue-900 rounded border border-white/20" />
             ))}
           </div>
        </div>

        {/* Center Table */}
        <div className="relative flex items-center justify-center">
          <div 
             className={`transition-all duration-300 rounded-full p-4 ${isHumanTurn && selectedCardId ? "cursor-pointer ring-4 ring-yellow-400/50 scale-105" : ""}`}
             onClick={handleTableClick}
          >
            <Table trick={currentTrick} winnerId={winner} />
          </div>
          
          <TurnTimer 
            duration={30} 
            isActive={isHumanTurn} 
            onTimeout={() => {
               // Auto play random valid move
               if (validMoves.length > 0) {
                 const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                 onPlayCard(randomMove);
                 toast("Time's up! Random card played.");
               }
            }}
          />
        </div>

        {/* Right AI */}
        <div className="flex flex-col items-center gap-2">
           <PlayerAvatar player={rightAI} isCurrentTurn={players.indexOf(rightAI) === currentTurn} position="right" />
           <div className="flex flex-col -space-y-8 mt-4">
             {rightAI.hand.map((_, i) => (
               <div key={i} className="w-12 h-8 bg-blue-900 rounded border border-white/20" />
             ))}
           </div>
        </div>
      </div>

      {/* Bottom Player */}
      <div className="relative z-20 flex flex-col items-center justify-end h-64">
        {isHumanTurn && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-4 text-white bg-black/60 px-4 py-2 rounded-full backdrop-blur font-bold animate-pulse"
           >
             {selectedCardId ? "Tap table to play" : "Your Turn - Select a card"}
           </motion.div>
        )}
        
        <Hand 
          cards={human.hand} 
          onCardClick={handleCardClick}
          selectedCardId={selectedCardId}
          isCurrentTurn={isHumanTurn}
          validMoves={validMoves}
          className="mb-[-40px] md:mb-0"
        />
        
        <div className="absolute bottom-4 right-4">
           <PlayerAvatar player={human} isCurrentTurn={isHumanTurn} position="bottom" className="flex-row-reverse" />
        </div>
      </div>
    </div>
  );
};

