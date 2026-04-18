import { motion } from 'motion/react';
import React from 'react';

interface DiceProps {
  value: number | null;
  onRoll: () => void;
  disabled: boolean;
  rolling: boolean;
}

const pipMap: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const Face = ({ value }: { value: number }) => (
  <div className="absolute inset-0 w-full h-full bg-white border-2 border-gray-100 rounded-[1.5rem] flex items-center justify-center p-4 shadow-inner" 
       style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}>
    <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-full h-full">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {pipMap[value].includes(i) && (
            <div className="w-3.5 h-3.5 rounded-full bg-primary shadow-sm" />
          )}
        </div>
      ))}
    </div>
    {/* Shine */}
    <div className="absolute top-1 left-2 w-8 h-4 bg-white/40 rounded-full blur-sm -rotate-45" />
  </div>
);

export default function Dice({ value, onRoll, disabled, rolling }: DiceProps) {
  const getRotation = (v: number | null) => {
    if (!v) return { rotateX: 20, rotateY: 20 };
    switch (v) {
      case 1: return { rotateX: 0, rotateY: 0 };
      case 2: return { rotateX: 90, rotateY: 0 };
      case 3: return { rotateX: 0, rotateY: -90 };
      case 4: return { rotateX: 0, rotateY: 90 };
      case 5: return { rotateX: -90, rotateY: 0 };
      case 6: return { rotateX: 180, rotateY: 0 };
      default: return { rotateX: 0, rotateY: 0 };
    }
  };

  const playRollSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const handleRollClick = () => {
    if (!disabled) {
      playRollSound();
      onRoll();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative perspective-[1000px] w-24 h-24 mb-12 cursor-pointer group" 
        onClick={handleRollClick}
      >
        <motion.div
  animate={rolling ? {
    rotateX: [0, 720, 1440, 2160, 2880],
    rotateY: [0, 360, 1080, 1800, 2520],
    scale: [1, 1.3, 0.8, 1.2, 1],
    transition: {
      duration: 1.2,
      ease: "easeInOut",
      repeat: Infinity
    }
  } : {
    ...getRotation(value),
    transition: { type: 'spring', damping: 15, stiffness: 150 }
  }}
  className="w-full h-full relative"
  style={{ transformStyle: 'preserve-3d' }}
>
          {/* Face 1 - Front */}
          <div style={{ transform: 'translateZ(48px)' }} className="absolute inset-0">
            <Face value={1} />
          </div>
          {/* Face 6 - Back */}
          <div style={{ transform: 'rotateX(180deg) translateZ(48px)' }} className="absolute inset-0">
            <Face value={6} />
          </div>
          {/* Face 2 - Top */}
          <div style={{ transform: 'rotateX(-90deg) translateZ(48px)' }} className="absolute inset-0">
            <Face value={2} />
          </div>
          {/* Face 5 - Bottom */}
          <div style={{ transform: 'rotateX(90deg) translateZ(48px)' }} className="absolute inset-0">
            <Face value={5} />
          </div>
          {/* Face 3 - Left */}
          <div style={{ transform: 'rotateY(90deg) translateZ(48px)' }} className="absolute inset-0">
            <Face value={3} />
          </div>
          {/* Face 4 - Right */}
          <div style={{ transform: 'rotateY(-90deg) translateZ(48px)' }} className="absolute inset-0">
            <Face value={4} />
          </div>
        </motion.div>

        {/* Dynamic Shadow */}
        <motion.div 
          animate={rolling ? {
            scale: [1, 0.5, 1.2, 0.6, 1],
            opacity: [0.2, 0.1, 0.3, 0.1, 0.2]
          } : {
            scale: 1,
            opacity: 0.2
          }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full blur-lg"
        />
      </div>

      {!disabled && !rolling && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-lg hover:bg-primary/90 transition-all border-b-4 border-primary/20 active:border-b-0 active:translate-y-1"
        >
          Your Turn • Roll
        </motion.div>
      )}
    </div>
  );
}
