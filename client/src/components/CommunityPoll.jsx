import React, { useState } from 'react';
import { BarChart3, CheckCircle2, Vote } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CommunityPoll() {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [votes, setVotes] = useState([
    { id: 1, text: "Ultra-Dense LFP Shenxing (CATL / BYD)", count: 540, pct: 41 },
    { id: 2, text: "Solid-State Ceramic Cells (QuantumScape / Toyota)", count: 420, pct: 32 },
    { id: 3, text: "Sodium-Ion Low-Cost Chemistry (Faradion / Reliance)", count: 230, pct: 18 },
    { id: 4, text: "Megawatt Battery Swapping Corridors", count: 120, pct: 9 }
  ]);

  const handleVote = (id) => {
    if (hasVoted) return;
    setSelectedOption(id);
    setHasVoted(true);

    // Trigger subtle confetti
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00aeef', '#38bdf8', '#10b981']
      });
    } catch (e) {}

    // Update vote counts
    setVotes(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, count: v.count + 1 } : v);
      const total = updated.reduce((sum, v) => sum + v.count, 0);
      return updated.map(v => ({ ...v, pct: Math.round((v.count / total) * 100) }));
    });
  };

  const totalVotes = votes.reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="bg-[#0e1422] rounded-2xl p-6 sm:p-7 border border-[#1b253b] shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1b253b]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-[#00aeef]">
            <Vote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Industry Pulse Poll
            </h3>
            <span className="text-[11px] text-gray-400">The EV Network Fleet &amp; Battery Intelligence</span>
          </div>
        </div>

        <span className="text-xs font-mono text-gray-400">
          {totalVotes.toLocaleString()} Votes
        </span>
      </div>

      <div>
        <h4 className="text-base font-bold text-white leading-snug">
          Which battery innovation will scale commercial heavy-duty electric trucks fastest by 2028?
        </h4>
      </div>

      <div className="space-y-3 pt-2">
        {votes.map((opt) => (
          <div 
            key={opt.id}
            onClick={() => handleVote(opt.id)}
            className={`relative overflow-hidden rounded-xl border p-3.5 transition-all cursor-pointer ${
              selectedOption === opt.id 
                ? 'border-[#00aeef] bg-[#0c192c]' 
                : hasVoted 
                  ? 'border-[#1b253b] bg-[#121826] cursor-default' 
                  : 'border-[#1b253b] bg-[#121826] hover:border-[#00aeef]/60 hover:bg-[#142036]'
            }`}>
            
            {/* Background percentage bar when voted */}
            {hasVoted && (
              <div 
                className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ${
                  selectedOption === opt.id ? 'bg-[#00aeef]/25' : 'bg-white/5'
                }`}
                style={{ width: `${opt.pct}%` }}
              />
            )}

            <div className="relative z-10 flex items-center justify-between text-xs sm:text-sm font-medium">
              <span className={`flex items-center ${selectedOption === opt.id ? 'text-white font-bold' : 'text-gray-200'}`}>
                {selectedOption === opt.id && (
                  <CheckCircle2 className="w-4 h-4 text-[#00aeef] mr-2 inline" />
                )}
                {opt.text}
              </span>

              {hasVoted && (
                <span className="font-mono font-bold text-white text-xs pl-3">
                  {opt.pct}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 flex justify-between items-center text-[11px] text-gray-500 font-mono">
        <span>{hasVoted ? 'Thank you for your vote!' : 'Select an option to participate'}</span>
        <span>Updated real-time</span>
      </div>
    </div>
  );
}
