import { motion, AnimatePresence } from 'motion/react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceProps {
  value: number | null;
  onRoll: () => void;
  disabled: boolean;
  rolling: boolean;
}

export default function Dice({ value, onRoll, disabled, rolling }: DiceProps) {
  // Pips positions for each dice value
  const pipMap: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  const currentPips = value ? pipMap[value] : [4];

  // Play sound effect
  const playRollSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Audio play blocked by browser policy until user interaction"));
  };

  const handleRollClick = () => {
    if (!disabled) {
      playRollSound();
      onRoll();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={rolling ? {
          rotateX: [0, 360, 720, 1080],
          rotateY: [0, 360, 720, 1080],
          scale: [1, 1.1, 1],
          y: [0, -20, 0]
        } : {}}
        transition={rolling ? {
          duration: 0.6,
          repeat: Infinity,
          ease: "linear"
        } : {}}
        className={`relative w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center cursor-pointer border-4 border-board-border
          ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:shadow-2xl'}
        `}
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
        onClick={handleRollClick}
      >
        <motion.div
          key={value}
          initial={!rolling ? { rotateX: -90, scale: 0.5, opacity: 0 } : {}}
          animate={!rolling ? { rotateX: 0, scale: 1, opacity: 1 } : {}}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          className="w-16 h-16 grid grid-cols-3 grid-rows-3 gap-1 p-1"
        >
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {currentPips.includes(i) && (
                <div className="w-3.5 h-3.5 rounded-full bg-primary shadow-inner" />
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>
      
      <button
        disabled={disabled}
        onClick={handleRollClick}
        className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg hover:bg-sky-500 disabled:bg-gray-300 transition-all uppercase tracking-widest text-[11px] ring-4 ring-primary/10"
      >
        {rolling ? 'Rolling...' : 'Roll for Turn'}
      </button>
    </div>
  );
}
