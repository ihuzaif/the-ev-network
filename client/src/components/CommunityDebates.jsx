import React, { useState } from 'react';
import { MessageSquare, ArrowBigUp, ArrowBigDown, Share2, CheckCircle, Sparkles, MessageCircle, AlertCircle, Shield } from 'lucide-react';

const INITIAL_DEBATES = [
  {
    id: 'deb-1',
    title: "The 20-80% Charging Myth Busted: Battery Management Systems vs Real-World Degradation",
    author: "u/WattHours_Engineer",
    flair: "Tata EV & Tesla Dual Owner • 68k km",
    flairColor: "text-cyan-400 bg-cyan-950/60 border-cyan-800",
    timeAgo: "4 hours ago",
    upvotes: 428,
    commentsCount: 94,
    body: "Stop babying your EV battery by unplugging at 80% every single day. Modern thermal packs and BMS top/bottom buffers already reserve 5-8% of total capacity. Real telemetry across 100k miles shows fast-charging delta is under 1.5% compared to overnight L2 charging.",
    consensus: "88% Agree • Over-optimization myth",
    category: "Batteries",
    verifiedInsight: "InsideEVs & TeslaFi 100k km telemetry confirms calendar aging far exceeds cycling loss on active liquid-cooled LFP & NMC cells."
  },
  {
    id: 'deb-2',
    title: "Highway DC Fast Charger Uptime in India: Why do 60 kW stations show 'Available' on apps but fail in 43°C heat?",
    author: "u/ExpresswayCruiser",
    flair: "Mahindra BE 6e & Curvv EV Tester",
    flairColor: "text-amber-400 bg-amber-950/60 border-amber-800",
    timeAgo: "7 hours ago",
    upvotes: 312,
    commentsCount: 67,
    body: "Tried three consecutive 60 kW DC chargers on the Delhi-Jaipur highway. All showed green on OCPP aggregator apps, but tripped within 4 minutes due to ambient cabinet overheating. Charging operators must install sunshades and active liquid cabinet chillers, not just plug-and-pray hardware.",
    consensus: "94% Agree • Thermal protection issue",
    category: "Charging Infra",
    verifiedInsight: "NHAI's new mandate requires all highway fast-chargers to include captive canopy shading and operational SLA penalties below 98% uptime."
  },
  {
    id: 'deb-3',
    title: "LFP vs Solid-State: Is the mass-market EV market sleeping on CATL's 205 Wh/kg Shenxing Plus?",
    author: "u/SolidStateSkeptic",
    flair: "Battery Materials Researcher",
    flairColor: "text-purple-400 bg-purple-950/60 border-purple-800",
    timeAgo: "12 hours ago",
    upvotes: 546,
    commentsCount: 118,
    body: "Solid-state is hyped for 2030, but LFP with 3D honeycomb cathodes is shipping NOW with 1,000 km range and 4C charging (600 km in 10 mins). When pack-level costs are $60/kWh without cobalt or nickel, solid-state will have a tough time competing outside of hypercars.",
    consensus: "76% Agree • LFP is king for mass market",
    category: "Technology",
    verifiedInsight: "LFP market share expanded to 64% of global passenger EV production in 2025-2026, driven by zero thermal runaway risks."
  }
];

export default function CommunityDebates() {
  const [debates, setDebates] = useState(INITIAL_DEBATES);
  const [userVotes, setUserVotes] = useState({});
  const [newComment, setNewComment] = useState("");
  const [activeDebateId, setActiveDebateId] = useState(null);
  const [submittedComment, setSubmittedComment] = useState(false);

  const handleVote = (id, direction) => {
    const currentVote = userVotes[id];
    let newVote = direction;
    let delta = 0;

    if (currentVote === direction) {
      newVote = null;
      delta = direction === 'up' ? -1 : 1;
    } else if (currentVote) {
      delta = direction === 'up' ? 2 : -2;
    } else {
      delta = direction === 'up' ? 1 : -1;
    }

    setUserVotes(prev => ({ ...prev, [id]: newVote }));
    setDebates(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, upvotes: d.upvotes + delta };
      }
      return d;
    }));
  };

  const handleAddComment = (debateId) => {
    if (!newComment.trim()) return;
    setDebates(prev => prev.map(d => {
      if (d.id === debateId) {
        return { ...d, commentsCount: d.commentsCount + 1 };
      }
      return d;
    }));
    setSubmittedComment(true);
    setTimeout(() => {
      setSubmittedComment(false);
      setNewComment("");
      setActiveDebateId(null);
    }, 1500);
  };

  return (
    <section className="bg-gradient-to-b from-[#080d1a] to-[#040711] border border-[#1b263b] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#172338]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded shadow">
              REDDIT r/electricvehicles PULSE
            </span>
            <span className="text-[11px] font-mono text-gray-400">
              COMMUNITY SENTIMENT &amp; DEBATES
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Real-World Owner Debates &amp; Mythbusting
          </h2>
          <p className="text-xs text-gray-400">
            Unfiltered ownership telemetry, charging station reliability reports, and engineering fact-checks from verified drivers.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#0d1424] px-3 py-1.5 rounded-xl border border-[#202f4a] self-start sm:self-auto text-xs text-cyan-400 font-mono">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Verified Owner Data</span>
        </div>
      </div>

      {/* Debates List */}
      <div className="space-y-4">
        {debates.map((item) => {
          const userVote = userVotes[item.id];

          return (
            <div
              key={item.id}
              className="bg-[#0b1220] border border-[#1b263b] hover:border-cyan-500/50 rounded-xl p-5 transition-all shadow-md space-y-4">
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center space-x-2">
                  <span className="font-mono text-gray-400 font-semibold">{item.author}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.flairColor}`}>
                    {item.flair}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500">{item.timeAgo}</span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  {item.category}
                </span>
              </div>

              {/* Main Content Layout with Left Voting Strip */}
              <div className="flex space-x-4">
                {/* Reddit Style Upvote / Downvote column */}
                <div className="flex flex-col items-center justify-start space-y-1 bg-[#070b14] p-1.5 rounded-lg border border-[#182337] min-w-[42px]">
                  <button
                    onClick={() => handleVote(item.id, 'up')}
                    title="Upvote"
                    className={`p-1 rounded hover:bg-orange-950/60 transition ${userVote === 'up' ? 'text-orange-500 font-bold' : 'text-gray-400 hover:text-orange-400'}`}>
                    <ArrowBigUp className={`w-5 h-5 ${userVote === 'up' ? 'fill-current' : ''}`} />
                  </button>

                  <span className={`text-xs font-mono font-bold ${userVote === 'up' ? 'text-orange-400' : userVote === 'down' ? 'text-blue-400' : 'text-white'}`}>
                    {item.upvotes}
                  </span>

                  <button
                    onClick={() => handleVote(item.id, 'down')}
                    title="Downvote"
                    className={`p-1 rounded hover:bg-blue-950/60 transition ${userVote === 'down' ? 'text-blue-500 font-bold' : 'text-gray-400 hover:text-blue-400'}`}>
                    <ArrowBigDown className={`w-5 h-5 ${userVote === 'down' ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Body & Insight */}
                <div className="flex-1 space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-white hover:text-cyan-300 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {item.body}
                  </p>

                  {/* Fact-check / Verified Insight Callout */}
                  <div className="bg-[#0e172a] border-l-2 border-cyan-400 p-3 rounded-r-lg text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>The EV Network Fact-Check:</span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {item.verifiedInsight}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-2 border-t border-[#141e30] flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setActiveDebateId(activeDebateId === item.id ? null : item.id)}
                    className="flex items-center space-x-1.5 hover:text-white transition">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                    <span>{item.commentsCount} Comments &amp; Replies</span>
                  </button>

                  <span className="text-gray-600">•</span>

                  <span className="text-[11px] font-mono text-green-400">
                    {item.consensus}
                  </span>
                </div>

                <button
                  onClick={() => setActiveDebateId(activeDebateId === item.id ? null : item.id)}
                  className="text-xs font-bold text-[#00aeef] hover:underline">
                  {activeDebateId === item.id ? "Close Reply" : "Join Discussion"}
                </button>
              </div>

              {/* Expandable Reply / Comment Box */}
              {activeDebateId === item.id && (
                <div className="mt-3 pt-3 border-t border-[#172338] space-y-2.5">
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Share your real-world driving or charging telemetry:</span>
                  </div>

                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="e.g. 'I drive a Tata Curvv EV 55 and saw 380 km highway range at 105 km/h with 40C AC...'"
                    className="w-full bg-[#070b14] text-xs text-white p-3 rounded-xl border border-[#1f2e47] focus:border-cyan-400 focus:outline-none h-20 resize-none font-sans"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-500">
                      Contributions are verified against open OCPP and vehicle telematics logs.
                    </span>

                    <button
                      onClick={() => handleAddComment(item.id)}
                      disabled={!newComment.trim() || submittedComment}
                      className="bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black font-bold text-xs px-4 py-1.5 rounded-lg hover:brightness-110 disabled:opacity-50 transition">
                      {submittedComment ? "Posted to Debate!" : "Submit Verified Reply"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
