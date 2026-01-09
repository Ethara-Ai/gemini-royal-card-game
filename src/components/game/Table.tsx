import React from 'react';
import { Card as CardComponent } from './Card';
import { PlayedCard } from '../../lib/types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface TableProps {
  trick: PlayedCard[];
  winnerId?: string | null;
}

export const Table: React.FC<TableProps> = ({ trick, winnerId }) => {
  const getPosition = (playerId: string) => {
    switch (playerId) {
      case 'p1': return 'bottom-0 translate-y-1/2'; // Human
      case 'ai-0': return 'left-0 -translate-x-1/2 -rotate-90'; // Left
      case 'ai-1': return 'top-0 -translate-y-1/2'; // Top
      case 'ai-2': return 'right-0 translate-x-1/2 rotate-90'; // Right
      default: return '';
    }
  };

  return (
    <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full border-4 border-white/10 bg-casino-felt flex items-center justify-center shadow-inner">
       {/* Felt texture overlay */}
       <div className="absolute inset-0 rounded-full opacity-30 bg-[radial-gradient(circle,_transparent_20%,_#000_20%,_#000_80%,_transparent_80%,_transparent),_radial-gradient(circle,_transparent_20%,_#000_20%,_#000_80%,_transparent_80%,_transparent)] bg-[length:4px_4px]" />
       
       <div className="relative w-40 h-40">
         {trick.map((played) => {
           const isWinner = winnerId === played.playerId;
           
           return (
             <motion.div
               key={played.card.id}
               className={clsx(
                 "absolute inset-0 flex items-center justify-center pointer-events-none",
                 getPosition(played.playerId)
               )}
               initial={{ scale: 1.2, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               layoutId={`card-${played.card.id}`}
             >
               <div className={clsx(
                 "relative transition-all duration-500",
                 isWinner && "scale-110 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] z-10"
               )}>
                 <CardComponent card={played.card} faceUp={true} />
                 {isWinner && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-4 -right-4 bg-casino-gold text-casino-black rounded-full p-1 text-xs font-bold border border-white shadow-lg"
                    >
                      WINNER
                    </motion.div>
                 )}
               </div>
             </motion.div>
           );
         })}
       </div>
    </div>
  );
};

