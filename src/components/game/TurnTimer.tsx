import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TurnTimerProps {
  duration: number; // seconds
  onTimeout?: () => void;
  isActive: boolean;
}

export const TurnTimer: React.FC<TurnTimerProps> = ({ duration, onTimeout, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    if (timeLeft <= 0) {
      onTimeout?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeout, duration]);

  if (!isActive) return null;

  const progress = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
      <div className="w-6 h-6 relative flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-gray-600" />
          <motion.circle 
            cx="12" cy="12" r="10" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="transparent" 
            className={isUrgent ? "text-red-500" : "text-casino-gold"}
            strokeDasharray="63"
            animate={{ strokeDashoffset: 63 - (63 * progress) / 100 }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
      </div>
      <span className={isUrgent ? "text-red-400 font-bold" : "text-white font-mono"}>
        {timeLeft}s
      </span>
    </div>
  );
};

