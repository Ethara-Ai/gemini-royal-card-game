import React from 'react';
import clsx from 'clsx';
import { Player } from '../../lib/types';
import { motion } from 'framer-motion';

interface PlayerAvatarProps {
  player: Player;
  isCurrentTurn: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ 
  player, 
  isCurrentTurn, 
  className 
}) => {
  return (
    <div className={clsx(
      "flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-300",
      isCurrentTurn ? "bg-white/10 ring-2 ring-casino-gold scale-105" : "bg-black/20",
      className
    )}>
      <div className="relative">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-white/20 flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-lg">
          {player.name.charAt(0)}
        </div>
        
        {isCurrentTurn && (
          <motion.div 
            className="absolute -inset-1 rounded-full border-2 border-casino-gold border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      <div className="text-center">
        <div className="font-bold text-white text-sm md:text-base text-shadow">{player.name}</div>
        <div className="text-xs text-gray-300 flex flex-col items-center">
          <span>Score: {player.score}</span>
          <span>Tricks: {player.tricksWon}</span>
        </div>
      </div>
    </div>
  );
};

