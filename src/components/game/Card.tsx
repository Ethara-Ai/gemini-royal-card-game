import React from 'react';
import { motion } from 'framer-motion';
import { BsSuitHeartFill, BsSuitDiamondFill, BsSuitClubFill, BsSuitSpadeFill } from 'react-icons/bs';
import { Card as CardType } from '../../lib/types';
import clsx from 'clsx';
import { useSettings } from '../../contexts/SettingsContext';

interface CardProps {
  card: CardType;
  faceUp?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  layoutId?: string;
}

const SuitIcon = ({ suit, className }: { suit: string; className?: string }) => {
  switch (suit) {
    case 'hearts': return <BsSuitHeartFill className={className} />;
    case 'diamonds': return <BsSuitDiamondFill className={className} />;
    case 'clubs': return <BsSuitClubFill className={className} />;
    case 'spades': return <BsSuitSpadeFill className={className} />;
    default: return null;
  }
};

export const Card: React.FC<CardProps> = ({ 
  card, 
  faceUp = true, 
  selectable = false, 
  selected = false, 
  onClick, 
  className,
  style,
  layoutId
}) => {
  const { settings } = useSettings();
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  const baseClasses = clsx(
    "relative w-24 h-36 rounded-xl shadow-lg border-2 border-white/10 select-none transition-transform will-change-transform",
    className
  );

  const getPatternStyle = () => {
    const color = settings.cardBack;
    switch (settings.cardPattern) {
      case 'checkerboard':
        return {
          backgroundColor: color,
          backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1)), linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1))`,
          backgroundPosition: '0 0, 10px 10px',
          backgroundSize: '20px 20px'
        };
      case 'diagonal':
        return {
          backgroundColor: color,
          backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 10px, transparent 10px, transparent 20px)`
        };
      case 'dots':
        return {
          backgroundColor: color,
          backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 2px, transparent 2px)`,
          backgroundSize: '15px 15px'
        };
      default:
        return { backgroundColor: color };
    }
  };

  return (
    <motion.div
      layoutId={layoutId || `card-${card.id}`}
      className={clsx(
        baseClasses,
        faceUp ? "bg-white" : "",
        selectable && "cursor-pointer hover:brightness-110",
        selected && "ring-4 ring-casino-gold ring-offset-2 ring-offset-transparent -translate-y-4"
      )}
      style={{
        ...style,
        ...(faceUp ? {} : getPatternStyle()),
      }}
      onClick={selectable ? onClick : undefined}
      whileHover={selectable ? { scale: 1.05 } : undefined}
      whileTap={selectable ? { scale: 0.95 } : undefined}
      initial={false}
      aria-label={faceUp ? `${card.rank} of ${card.suit}` : "Card back"}
      role={selectable ? "button" : "img"}
      tabIndex={selectable ? 0 : -1}
      onKeyDown={(e) => {
        if (selectable && (e.key === 'Enter' || e.key === ' ')) {
          onClick?.();
        }
      }}
    >
      {faceUp ? (
        <div className={clsx("w-full h-full flex flex-col justify-between p-2", isRed ? "text-casino-red" : "text-black")}>
          <div className="flex flex-col items-center self-start">
            <span className="text-xl font-bold leading-none">{card.rank}</span>
            <SuitIcon suit={card.suit} className="text-sm" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <SuitIcon suit={card.suit} className="text-6xl" />
          </div>

          <div className="flex flex-col items-center self-end rotate-180">
            <span className="text-xl font-bold leading-none">{card.rank}</span>
            <SuitIcon suit={card.suit} className="text-sm" />
          </div>
        </div>
      ) : (
         <div className="absolute inset-2 border-2 border-white/20 rounded-lg" />
      )}
    </motion.div>
  );
};
