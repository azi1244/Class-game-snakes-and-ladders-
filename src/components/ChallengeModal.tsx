import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SquareData } from '../types';
import { validatePlural, checkSentenceUsage } from '../services/gemini';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

interface ChallengeModalProps {
  square: SquareData;
  playerName: string;
  isChallengeMode: boolean;
  onAnswer: (correct: boolean) => void;
}

export default function ChallengeModal({ square, playerName, isChallengeMode, onAnswer }: ChallengeModalProps) {
  const [pluralInput, setPluralInput] = useState('');
  const [sentenceInput, setSentenceInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    
    const result = await validatePlural(square.word, pluralInput, square.plural);
    
    let isCorrect = result.isCorrect;
    let finalFeedback = result.feedback;

    if (isCorrect && isChallengeMode) {
      const sentenceResult = await checkSentenceUsage(square.word, square.plural, sentenceInput);
      isCorrect = sentenceResult.isCorrect;
      finalFeedback = sentenceResult.feedback;
    }

    setFeedback(finalFeedback);
    setIsDone(true);
    setLoading(false);
    
    // Give time to read feedback
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-ink/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full border-4 border-board-border"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-ink uppercase tracking-tighter flex items-center justify-center gap-2">
              <Sparkles className="text-secondary" />
              {playerName}'s Challenge!
            </h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Landed on: {square.word} {square.icon}</p>
          </div>

          {!isDone ? (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Plural of "{square.word}"?
                </label>
                <input
                  autoFocus
                  type="text"
                  value={pluralInput}
                  onChange={(e) => setPluralInput(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-square-bg border-2 border-board-border focus:border-primary focus:bg-white outline-none text-xl font-bold transition-all"
                  placeholder="plural_word_here"
                />
              </div>

              {isChallengeMode && (
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Sentence Bonus:
                  </label>
                  <textarea
                    value={sentenceInput}
                    onChange={(e) => setSentenceInput(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-square-bg border-2 border-board-border focus:border-primary focus:bg-white outline-none h-24 italic transition-all font-medium text-sm"
                    placeholder="Write a sentence using the plural word..."
                  />
                </div>
              )}

              <button
                disabled={loading || !pluralInput}
                onClick={handleSubmit}
                className="w-full py-5 bg-accent-green text-ink rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-tighter"
              >
                {loading ? 'Analyzing...' : (
                  <>Submit Answer <ArrowRight size={24} strokeWidth={3} /></>
                )}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className={`text-7xl mb-6 ${feedback?.includes('Perfect') || feedback?.includes('Great') ? 'animate-bounce' : ''}`}>
                {feedback?.includes('Perfect') || feedback?.includes('Great') ? '🦁' : '📚'}
              </div>
              <p className="text-xl font-black text-ink mb-4 uppercase tracking-tighter leading-tight">{feedback}</p>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                <BookOpen size={14} />
                Knowledge: {square.word} → {square.plural}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
