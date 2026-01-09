import React from 'react';
import { Card as CardComponent } from './Card';
import { Card } from '../../lib/types';
import { AnimatePresence } from 'framer-motion';

interface HandProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  selectedCardId?: string | null;
  isCurrentTurn: boolean;
  validMoves?: Card[];
  className?: string;
  faceUp?: boolean; // Opponent hands are face down usually
}

export const Hand: React.FC<HandProps> = ({
  cards,
  onCardClick,
  selectedCardId,
  isCurrentTurn,
  validMoves = [],
  className,
  faceUp = true
}) => {
  // Fan logic
  const count = cards.length;
  const centerIndex = (count - 1) / 2;
  
  // Calculate rotation and position for fanning
  const getCardStyle = (index: number) => {
    const diff = index - centerIndex;
    const rotation = diff * 5; // 5 degrees per card
    const yOffset = Math.abs(diff) * 5; // slight arc down on sides
    
    return {
      rotate: rotation,
      y: yOffset,
      x: diff * 30, // Horizontal overlap spacing (negative/positive from center)
      zIndex: index,
    };
  };

  return (
    <div className={`relative h-48 flex justify-center items-end ${className}`}>
      <AnimatePresence>
        {cards.map((card, index) => {
          const isValid = validMoves.some(c => c.id === card.id);
          const isSelected = selectedCardId === card.id;
          const isInteractable = isCurrentTurn && isValid && faceUp;

          const { rotate, y, x, zIndex } = getCardStyle(index);

          return (
            <div 
              key={card.id}
              className="absolute origin-bottom transition-all duration-300"
              style={{
                zIndex: isSelected ? 50 : zIndex,
                transform: `translateX(${x}px) translateY(${y}px) rotate(${rotate}deg)`,
              }}
            >
              <CardComponent 
                card={card}
                faceUp={faceUp}
                selectable={isInteractable}
                selected={isSelected}
                onClick={() => isInteractable && onCardClick?.(card)}
                className={!isValid && isCurrentTurn && faceUp ? "brightness-50 grayscale" : ""}
                layoutId={`card-${card.id}`}
              />
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

