import React from 'react';
import { motion } from 'motion/react';
import { SquareData } from '../types';
import { PLAYER_COLORS } from '../constants';

export const getCoords = (num: number, rows: number[][], cols: number, gridRows: number) => {
  let rowIndex = 0, colIndex = 0;
  rows.forEach((r, idx) => {
    const cIdx = r.indexOf(num);
    if (cIdx !== -1) {
      rowIndex = idx;
      colIndex = cIdx;
    }
  });

  const cellWidth = 400 / cols;
  const cellHeight = 600 / gridRows;

  return {
    x: colIndex * cellWidth + cellWidth / 2,
    y: rowIndex * cellHeight + cellHeight / 2
  };
};

interface BoardProps {
  squares: SquareData[];
  targetPosition?: number | null;
}

export default function Board({ squares, targetPosition, children }: BoardProps & { children?: React.ReactNode }) {
  // 24 squares layout (Portrait 4x6)
  const rows = [
    [24, 23, 22, 21],
    [17, 18, 19, 20],
    [16, 15, 14, 13],
    [9, 10, 11, 12],
    [8, 7, 6, 5],
    [1, 2, 3, 4]
  ];

  const cols = 4;
  const gridRows = 6;

  const getLocalCoords = (num: number) => getCoords(num, rows, cols, gridRows);
  const landingTarget = targetPosition ? getLocalCoords(targetPosition) : null;

  return (
    <div className="relative h-full w-full max-w-[500px] mx-auto overflow-visible">
      {/* 24 square Grid Layout */}
      <div className="grid grid-cols-4 grid-rows-6 gap-3 h-full relative">
        {/* Central Dice Zone */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
           <motion.div 
             animate={landingTarget ? {
               x: landingTarget.x - 200, 
               y: landingTarget.y - 300,
               scale: 0.6,
             } : {
               x: 0,
               y: 0,
               scale: 1,
             }}
             initial={{ scale: 0.9, opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ 
               type: "spring", 
               damping: 12, 
               stiffness: 70,
               mass: 2 // Make it feel heavy
             }}
             className="pointer-events-auto relative group"
           >
             {/* Background Glow */}
             {!landingTarget && (
               <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full scale-150 group-hover:bg-primary/20 transition-colors" />
             )}
             <div className="relative z-10">
               {children}
             </div>
           </motion.div>
        </div>

        {rows.flat().map((num) => {
          const square = squares.find(s => s.id === num);
          const isTarget = num === targetPosition;

          return (
            <motion.div
              key={num}
              animate={isTarget ? { scale: [1, 1.05, 1], borderColor: PLAYER_COLORS[0] } : {}}
              className={`relative rounded-3xl flex flex-col items-center justify-center border-[6px] transition-all duration-300
                ${num % 2 === 0 ? 'bg-white border-board-border shadow-[0_6px_0_#d1d8df]' : 'bg-gray-50 border-board-border shadow-[0_6px_0_#cbd3da]'}
              `}
            >
              <div className="absolute top-2 left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ring-2 ring-white/10 bg-gray-200 text-gray-500">
                {num}
              </div>
              
              {square && (
                <div className="flex flex-col items-center text-center px-1 py-1">
                  <span className="text-4xl sm:text-5xl mb-2 drop-shadow-md transform hover:scale-105 transition-transform cursor-default">
                    {square.icon}
                  </span>
                  <div className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-tight bg-primary/5 text-primary border border-primary/10">
                    {square.word}
                  </div>
                </div>
              )}

              {/* Decorative corner accents for a "Premium" board look */}
              <div className="absolute bottom-1 right-1 opacity-10">
                 <div className="w-4 h-4 border-r-2 border-b-2 border-ink rounded-br-md" />
              </div>

              {/* Active Highlight Ring (when dice target) */}
              {isTarget && (
                <motion.div 
                  layoutId="target-ring"
                  className="absolute inset-0 rounded-[1.5rem] border-4 border-primary z-10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
