import { RoundRecord } from '../types';
import { Check, X } from 'lucide-react';

interface ScoreBoardProps {
  rounds: RoundRecord[];
}

export default function ScoreBoard({ rounds }: ScoreBoardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border-3 border-board-border flex-1 flex flex-col">
      <div className="bg-gray-50 p-4 border-b-2 border-board-border">
        <h3 className="font-bold uppercase tracking-wider text-xs text-primary">Class Progress Log</h3>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black">
            <tr>
              <th className="px-3 py-3 border-b-2 border-board-border w-12 text-center">No.</th>
              <th className="px-3 py-3 border-b-2 border-board-border border-l">Word Mastered</th>
              <th className="px-3 py-3 border-b-2 border-board-border text-center w-16">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-square-bg">
            {rounds.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-16 text-center text-gray-300 italic font-medium">No results yet. Roll the dice to begin!</td>
              </tr>
            )}
            {[...rounds].reverse().map((r, idx) => (
              <tr key={idx} className="hover:bg-square-bg/50 transition-colors">
                <td className="px-3 py-3 text-center font-bold text-gray-400">{rounds.length - idx}</td>
                <td className="px-3 py-3 border-l text-ink font-bold text-sm tracking-tight">{r.player1Word}</td>
                <td className="px-3 py-3 text-center">
                  {r.player1Correct === true && (
                    <div className="inline-flex items-center gap-1 text-accent-green font-black uppercase text-[10px]">
                      <Check size={14} strokeWidth={4} /> PASS
                    </div>
                  )}
                  {r.player1Correct === false && (
                    <div className="inline-flex items-center gap-1 text-accent-red font-black uppercase text-[10px]">
                      <X size={14} strokeWidth={4} /> TRY AGAIN
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
