import { motion } from 'motion/react';
import { SquareData } from '../types';
import { SNAKES, LADDERS } from '../constants';

interface BoardProps {
  squares: SquareData[];
  playerPositions: { id: number, position: number, color: string }[];
}

export default function Board({ squares, playerPositions }: BoardProps) {
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

  // Coordinate helper based on 400x600 viewBox for portrait
  const getCoords = (num: number) => {
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

  const ladderConfigs = [
    { start: 3, end: 10 },
    { start: 8, end: 15 },
    { start: 14, end: 21 }
  ];

  const snakeConfigs = [
    { start: 11, end: 4, cp: [250, 400] },
    { start: 18, end: 7, cp: [350, 450] },
    { start: 22, end: 12, cp: [100, 300] }
  ];

  return (
    <div className="relative h-full w-full max-w-[500px] mx-auto overflow-visible">
      {/* Visual Links for Snakes and Ladders */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" viewBox="0 0 400 600">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer><feFuncA type="linear" slope="0.4" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* --- LADDERS --- */}
        {ladderConfigs.map((config, i) => {
          const s = getCoords(config.start);
          const e = getCoords(config.end);
          const dx = e.x - s.x;
          const dy = e.y - s.y;
          const length = Math.sqrt(dx*dx + dy*dy);
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          
          return (
             <g key={`ladder-${i}`} transform={`translate(${s.x}, ${s.y}) rotate(${angle})`} filter="url(#shadow)">
               <line x1="0" y1="-14" x2={length} y2="-14" stroke="#8B4513" strokeWidth="10" strokeLinecap="round" />
               <line x1="0" y1="14" x2={length} y2="14" stroke="#8B4513" strokeWidth="10" strokeLinecap="round" />
               <line x1="2" y1="-14" x2={length-2} y2="-14" stroke="#A0522D" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
               
               {[0.2, 0.4, 0.6, 0.8].map((p, j) => (
                 <line key={j} x1={length*p} y1="-14" x2={length*p} y2="14" stroke="#D2691E" strokeWidth="6" strokeLinecap="round" />
               ))}
               {[0.2, 0.4, 0.6, 0.8].map((p, j) => (
                 <circle key={`bolt-${j}`} cx={length*p} cy="-14" r="2" fill="#5D2906" />
               ))}
               {[0.2, 0.4, 0.6, 0.8].map((p, j) => (
                 <circle key={`bolt2-${j}`} cx={length*p} cy="14" r="2" fill="#5D2906" />
               ))}
             </g>
          );
        })}

        {/* --- SNAKES --- */}
        {snakeConfigs.map((config, i) => {
          const s = getCoords(config.start);
          const e = getCoords(config.end);
          
          return (
            <g key={`snake-${i}`} filter="url(#shadow)">
              <path 
                d={`M${s.x},${s.y} Q${config.cp[0]},${config.cp[1]} ${e.x},${e.y}`} 
                className="stroke-accent-red fill-none stroke-[20] stroke-linecap-round" 
              />
              <path 
                d={`M${s.x},${s.y} Q${config.cp[0]},${config.cp[1]} ${e.x},${e.y}`} 
                className="stroke-white/20 fill-none stroke-[20] stroke-linecap-round" 
                style={{ strokeDasharray: "15,15" }}
              />
              <path 
                d={`M${s.x},${s.y} Q${config.cp[0]},${config.cp[1]} ${e.x},${e.y}`} 
                className="stroke-black/10 fill-none stroke-[10] stroke-linecap-round" 
                style={{ strokeDashoffset: 5, strokeDasharray: "10,20" }}
              />
              
              <g transform={`translate(${s.x}, ${s.y})`}>
                <circle r="18" fill="#FF4757" stroke="#C0392B" strokeWidth="2" />
                <circle cx="-6" cy="-4" r="4" fill="white" /><circle cx="6" cy="-4" r="4" fill="white" />
                <circle cx="-6" cy="-4" r="2" fill="black" /><circle cx="6" cy="-4" r="2" fill="black" />
                <circle cx="-8" cy="4" r="3" fill="#FF7F50" opacity="0.4" />
                <circle cx="8" cy="4" r="3" fill="#FF7F50" opacity="0.4" />
                <motion.path 
                  animate={{ scaleY: [1, 1.5, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  d="M0,10 L-2,18 M0,10 L2,18" stroke="#eccc68" strokeWidth="3" fill="none" 
                />
              </g>
              <circle cx={e.x} cy={e.y} r="6" fill="#C0392B" />
            </g>
          );
        })}
      </svg>

      <div className="grid grid-cols-4 grid-rows-6 gap-3 h-full">
        {rows.flat().map((num) => {
          const square = squares.find(s => s.id === num);
          const playersHere = playerPositions.filter(p => p.position === num);
          const isStart = num === 1;
          const isFinish = num === 24;

          return (
            <motion.div
              key={num}
              className={`relative rounded-3xl flex flex-col items-center justify-center border-[6px] transition-all duration-300
                ${isStart ? 'bg-accent-green border-green-400 text-white shadow-[0_8px_0_#2ecc71,0_15px_30px_rgba(46,204,113,0.3)]' : 
                  isFinish ? 'bg-primary border-blue-400 text-white shadow-[0_8px_0_#0984e3,0_15px_30px_rgba(9,132,227,0.3)]' : 
                  num % 2 === 0 ? 'bg-white border-board-border shadow-[0_6px_0_#d1d8df]' : 'bg-gray-50 border-board-border shadow-[0_6px_0_#cbd3da]'}
              `}
            >
              <div className={`absolute top-2 left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ring-2 ring-white/10
                ${isStart || isFinish ? 'bg-black/20 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                {num}
              </div>
              
              {square && (
                <div className="flex flex-col items-center text-center px-1 py-1">
                  <span className="text-4xl sm:text-5xl mb-2 drop-shadow-md transform hover:scale-105 transition-transform cursor-default">
                    {square.icon}
                  </span>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-tight
                    ${isStart || isFinish ? 'bg-white/20 text-white' : 'bg-primary/5 text-primary border border-primary/10'}
                  `}>
                    {square.word}
                  </div>
                </div>
              )}

              {/* Decorative corner accents for a "Premium" board look */}
              {!isStart && !isFinish && (
                <div className="absolute bottom-1 right-1 opacity-10">
                   <div className="w-4 h-4 border-r-2 border-b-2 border-ink rounded-br-md" />
                </div>
              )}

              {/* Player Markers */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-2 z-20">
                {playersHere.map(p => (
                  <motion.div
                    key={p.id}
                    layoutId={`player-${p.id}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-white shadow-2xl flex items-center justify-center font-black text-white text-lg ring-4 ring-black/10 z-30"
                    style={{ 
                      backgroundColor: p.color,
                      boxShadow: `0 10px 0 ${p.color}88, 0 15px 30px rgba(0,0,0,0.2)`
                    }}
                  >
                    <span className="animate-pulse">P{p.id}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
