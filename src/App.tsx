import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Swords, Settings2, Info } from 'lucide-react';
import Board from './components/Board';
import Dice from './components/Dice';
import ChallengeModal from './components/ChallengeModal';
import ScoreBoard from './components/ScoreBoard';
import { Player, GameState, RoundRecord } from './types';
import { SQUARES, PLAYER_COLORS } from './constants';

const INITIAL_PLAYER: Player = { id: 1, name: 'Student', position: 1, color: '#00A8FF', score: 0 };

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    players: [INITIAL_PLAYER],
    currentPlayerIndex: 0,
    status: 'idle',
    lastRoll: null,
    targetPosition: null,
    currentSquare: null,
    rounds: [],
    isChallengeMode: false,
  });

  const currentPlayer = gameState.players[0];

  const playVictorySound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play blocked by browser policy"));
  };

  const handleRoll = () => {
    if (gameState.status !== 'idle') return;

    setGameState(prev => ({ ...prev, status: 'rolling' }));
    
    // 1. Roll Dice (1.2 seconds of animation)
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      let newPosition = currentPlayer.position + roll;
      
      // Wrap around for infinite play
      if (newPosition > 24) {
        newPosition = (newPosition % 24) || 1;
      }

      // 2. Stop rolling, show dice value, and MOVE the token immediately
      setGameState(prev => ({
        ...prev,
        lastRoll: roll,
        targetPosition: newPosition,
        status: 'moving',
        players: [{ ...prev.players[0], position: newPosition }]
      }));

      // 3. Wait for token move animation + "Deep Breath" moment (3 seconds)
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          status: 'answering',
          currentSquare: SQUARES.find(s => s.id === newPosition) || null,
        }));
      }, 3000);

    }, 1200);
  };

  const handleAnswer = (correct: boolean) => {
    const square = gameState.currentSquare;
    if (!square) return;

    let finalPosition = square.id;
    let nextRound = [...gameState.rounds];

    if (!correct) {
      finalPosition = Math.max(1, finalPosition - 1);
    }

    nextRound.push({
      round: nextRound.length + 1,
      player1Word: square.word,
      player1Correct: correct,
      player2Word: '', 
      player2Correct: null,
    });

    setGameState(prev => ({
      ...prev,
      players: [{ ...currentPlayer, position: finalPosition, score: currentPlayer.score + (correct ? 1 : 0) }],
      rounds: nextRound,
      status: 'idle',
      currentSquare: null,
      targetPosition: null, // Reset dice to center
    }));
  };

  const resetGame = () => {
    setGameState({
      players: [INITIAL_PLAYER],
      currentPlayerIndex: 0,
      status: 'idle',
      lastRoll: null,
      targetPosition: null,
      currentSquare: null,
      rounds: [],
      isChallengeMode: gameState.isChallengeMode,
    });
  };

  return (
    <div className="min-h-screen bg-app-bg text-ink p-4 sm:p-8 flex flex-col max-w-7xl mx-auto selection:bg-primary/20">
      {/* Header with Teacher Controls */}
      <header className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6 glass-card p-6 rounded-[32px] card-shadow">
        <div className="title-block flex items-center gap-4">
          <div className="bg-primary p-4 rounded-2xl shadow-lg rotate-[-3deg]">
             <Swords size={32} className="text-white" />
          </div>
          <div>
            <h1 className="m-0 text-[40px] text-ink font-black uppercase tracking-tighter leading-none mb-1">
              Plural Power!
            </h1>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black bg-accent-green px-2 py-0.5 rounded text-white uppercase tracking-widest">Version 2.0</span>
               <p className="m-0 text-xs font-bold text-gray-400 italic">Teacher's Multimedia Adventure</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-100/50 p-2.5 rounded-[20px] flex-wrap justify-center border border-white">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 hidden sm:block">Control Panel</div>
          
          <button
            onClick={() => setGameState(p => ({ ...p, isChallengeMode: !p.isChallengeMode }))}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-[3px] transition-all font-black text-sm active:scale-95 ${
              gameState.isChallengeMode ? 'border-secondary bg-secondary text-white shadow-[0_4px_0_#D35400]' : 'border-gray-200 text-gray-400 bg-white shadow-[0_4px_0_#E5E7EB]'
            }`}
          >
            <Settings2 size={18} />
            CHALLENGE MODE
          </button>
          
          <button
            onClick={resetGame}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-[3px] border-gray-200 hover:bg-gray-50 rounded-xl text-gray-500 transition-all font-black text-sm active:scale-95 shadow-[0_4px_0_#E5E7EB]"
          >
            <RotateCcw size={18} />
            RESET CLASS
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-10 flex-1 max-w-2xl mx-auto w-full">
        
        <div className="flex flex-col gap-8">
          {/* Class Score Card */}
          <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border-[4px] border-primary card-shadow relative overflow-hidden">
            <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Scoreboard</span>
              <div className="text-5xl font-black text-ink flex items-baseline gap-2">
                {currentPlayer.score} 
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Pts</span>
              </div>
            </div>
            <div className="bg-primary text-white px-6 py-4 rounded-[24px] shadow-lg flex flex-col items-center transform hover:rotate-1 transition-transform">
              <span className="text-[8px] font-black uppercase opacity-70 tracking-widest">Locater</span>
              <div className="text-xl font-black italic">SQ {currentPlayer.position}</div>
            </div>
          </div>

          {/* Board Container - Portrait Mode */}
          <div className="bg-white border-[6px] border-board-border rounded-[44px] p-6 relative shadow-2xl flex items-center justify-center min-h-[850px] card-shadow">
            <Board 
              squares={SQUARES} 
              targetPosition={gameState.targetPosition}
            >
              <Dice 
                value={gameState.lastRoll} 
                onRoll={handleRoll} 
                disabled={gameState.status !== 'idle'} 
                rolling={gameState.status === 'rolling'}
              />
            </Board>
            
            <AnimatePresence>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls Section - Now below the board */}
        <div className="flex flex-col gap-6">
          <div className="bg-secondary text-white p-6 rounded-[32px] shadow-[0_10px_0_#E67E22] flex flex-col justify-center">
            <h2 className="m-0 mb-3 text-lg font-black flex items-center gap-2 uppercase tracking-tight">
              <Info size={24} /> Rules
            </h2>
            <ul className="m-0 pl-5 text-[15px] leading-snug list-disc space-y-2 font-bold opacity-95">
              <li>Roll the dice & move.</li>
              <li>Give the plural to stay.</li>
              <li>Challenge Mode adds sentences!</li>
            </ul>
          </div>

          {/* Progress Tracker */}
          <div className="bg-white rounded-[32px] p-6 border-2 border-board-border shadow-sm overflow-hidden flex flex-col max-h-[300px]">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <RotateCcw size={14} /> Round History
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <ScoreBoard rounds={gameState.rounds} />
            </div>
            <div className="mt-4 p-3 bg-primary/5 rounded-xl text-[10px] text-primary/80 font-black text-center uppercase tracking-widest border border-primary/10">
              {gameState.isChallengeMode ? '🚀 AI Sentence Verification Active' : '📍 Vocabulary Mode Active'}
            </div>
          </div>
        </div>
      </main>

      {/* Global Challenge Modal */}
      {gameState.status === 'answering' && gameState.currentSquare && (
        <ChallengeModal 
          square={gameState.currentSquare}
          playerName="Classmate"
          isChallengeMode={gameState.isChallengeMode}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
}
