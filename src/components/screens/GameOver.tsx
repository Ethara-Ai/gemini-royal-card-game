import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { motion } from 'framer-motion';
import { Player } from '../../lib/types';

interface GameOverProps {
  winnerId: string | null;
  players: Player[];
  onPlayAgain: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ winnerId, players, onPlayAgain }) => {
  const { width, height } = useWindowSize();
  const winner = players.find(p => p.id === winnerId);
  const isHumanWinner = winner?.type === 'human';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {isHumanWinner && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center border border-white/10"
      >
        <h2 className="text-4xl font-bold mb-2 text-casino-gold">
          {isHumanWinner ? "Congratulations!" : "Game Over"}
        </h2>
        <p className="text-xl text-white mb-8">
          {isHumanWinner ? "You won the game!" : `${winner?.name} takes the pot!`}
        </p>

        <div className="bg-gray-900 rounded-xl p-4 mb-8">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4">Final Scores</h3>
          <div className="space-y-3">
            {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
               <div key={p.id} className="flex justify-between items-center border-b border-gray-800 last:border-0 pb-2 last:pb-0">
                 <div className="flex items-center gap-3">
                   <span className="text-gray-500 font-mono w-6 text-left">{i + 1}.</span>
                   <span className={p.id === winnerId ? "text-casino-gold font-bold" : "text-white"}>
                     {p.name} {p.type === 'human' && "(You)"}
                   </span>
                 </div>
                 <div className="font-bold text-white">{p.score} pts</div>
               </div>
            ))}
          </div>
        </div>

        <button 
          onClick={onPlayAgain}
          className="w-full bg-casino-gold hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl shadow-lg transition-transform hover:scale-105"
        >
          Play Again
        </button>
      </motion.div>
    </div>
  );
};

