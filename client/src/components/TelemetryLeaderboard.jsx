import React, { useState } from 'react';
import { Zap, Gauge, Flame, ShieldAlert, Award, ChevronRight, Activity, Cpu } from 'lucide-react';

const TELEMETRY_DATA = {
  acceleration: [
    { rank: 1, name: "Rimac Nevera Time Attack", brand: "Rimac", time: "1.81s", topSpeed: "412 km/h", power: "1,914 hp", architecture: "800V SiC", cd: "0.300", badge: "WORLD RECORD", region: "Global" },
    { rank: 2, name: "Xiaomi SU7 Ultra", brand: "Xiaomi", time: "1.97s", topSpeed: "350 km/h", power: "1,526 hp", architecture: "897V Dual SiC", cd: "0.195", badge: "NÜRBURGRING 6:46", region: "Global" },
    { rank: 3, name: "Tesla Model S Plaid", brand: "Tesla", time: "1.99s", topSpeed: "322 km/h", power: "1,020 hp", architecture: "400V Tri-Motor", cd: "0.208", badge: "PRODUCTION BENCHMARK", region: "Global" },
    { rank: 4, name: "Porsche Taycan Turbo GT", brand: "Porsche", time: "2.20s", topSpeed: "305 km/h", power: "1,019 hp", architecture: "800V SiC", cd: "0.229", badge: "WEISSACH PACKAGE", region: "Global" },
    { rank: 5, name: "Hyundai Ioniq 5 N", brand: "Hyundai", time: "3.40s", topSpeed: "260 km/h", power: "641 hp", architecture: "800V E-GMP", cd: "0.288", badge: "TRACK DRIFT MODE", region: "Global" },
    { rank: 6, name: "Tata Curvv EV 55 (Tested)", brand: "Tata", time: "8.60s", topSpeed: "160 km/h", power: "167 hp", architecture: "actia.ev 400V", cd: "0.261", badge: "INDIA EXPRESSWAY", region: "India" },
    { rank: 7, name: "Mahindra BE 6e", brand: "Mahindra", time: "6.70s", topSpeed: "175 km/h", power: "281 hp", architecture: "INGLO 400V/800V", cd: "0.258", badge: "BORN ELECTRIC", region: "India" }
  ],
  charging: [
    { rank: 1, name: "NHAI Megawatt Corridor (MCS)", brand: "NHAI / Freight", rate: "1,200 kW", time1080: "18 mins (Heavy Truck)", architecture: "1250V MCS", status: "National Freight Grid", region: "India" },
    { rank: 2, name: "Rimac Nevera", brand: "Rimac", rate: "500 kW", time1080: "19 mins (120 kWh)", architecture: "800V Dedicated", status: "Hypercar Tier", region: "Global" },
    { rank: 3, name: "Xiaomi SU7 Ultra (CATL Qilin II)", brand: "Xiaomi", rate: "480 kW", time1080: "11 mins (10-80%)", architecture: "897V SiC (5.2C)", status: "5.2C Ultra-Charge", region: "Global" },
    { rank: 4, name: "CATL Shenxing Plus (LFP)", brand: "CATL", rate: "400 kW", time1080: "10 mins (600 km added)", architecture: "4C LFP Nanotech", status: "Mass Production", region: "Global" },
    { rank: 5, name: "Tata TPEM 800V Platform", brand: "Tata Motors", rate: "350 kW", time1080: "12 mins (10-80%)", architecture: "800V SiC", status: "Next-Gen 2026", region: "India" },
    { rank: 6, name: "Porsche Taycan Turbo GT", brand: "Porsche", rate: "320 kW", time1080: "18 mins (10-80%)", architecture: "800V High-Current", status: "Production", region: "Global" },
    { rank: 7, name: "Tesla Supercharger V4", brand: "Tesla", rate: "250 kW", time1080: "24 mins (10-80%)", architecture: "V4 Cabinet Ready", status: "Global Rollout", region: "Global" }
  ],
  highwayRange: [
    { rank: 1, name: "Lucid Air Grand Touring", claimed: "830 km (EPA)", tested70: "660 km (79.5%)", consumption: "14.2 kWh/100km", temp: "24°C", diff: "-20.5%", verdict: "Highway range champion", region: "Global" },
    { rank: 2, name: "Mercedes EQS 450+", claimed: "780 km (WLTP)", tested70: "635 km (81.4%)", consumption: "15.1 kWh/100km", temp: "22°C", diff: "-18.6%", verdict: "Superior aerodynamic slipstream", region: "Global" },
    { rank: 3, name: "Tesla Model 3 Long Range", claimed: "629 km (WLTP)", tested70: "505 km (80.3%)", consumption: "14.0 kWh/100km", temp: "25°C", diff: "-19.7%", verdict: "Consistent highway thermal efficiency", region: "Global" },
    { rank: 4, name: "Tata Curvv EV 55 (Expressway)", claimed: "502 km (ARAI)", tested70: "378 km (75.3%)", consumption: "14.5 kWh/100km", temp: "42°C AC ON", diff: "-24.7%", verdict: "Resilient in extreme Indian summer heat", region: "India" },
    { rank: 5, name: "MG ZS EV 50.3", claimed: "461 km (ARAI)", tested70: "318 km (68.9%)", consumption: "15.8 kWh/100km", temp: "41°C AC ON", diff: "-31.1%", verdict: "Higher high-speed wind drag penalty", region: "India" },
    { rank: 6, name: "Hyundai Kona Electric", claimed: "452 km (ARAI)", tested70: "305 km (67.4%)", consumption: "16.1 kWh/100km", temp: "39°C AC ON", diff: "-32.6%", verdict: "Older generation thermal pack", region: "India" }
  ]
};

export default function TelemetryLeaderboard() {
  const [activeTab, setActiveTab] = useState('acceleration');

  return (
    <section className="bg-gradient-to-b from-[#070b14] via-[#09101f] to-[#060911] border border-[#1b263b] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background aerodynamic speed lines effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Formula 1 speed styling */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#172338]">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="bg-[#00aeef] text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm transform skew-x-[-10deg] inline-flex items-center shadow-sm shadow-cyan-500/50">
              <span className="transform skew-x-[10deg] flex items-center">
                <Flame className="w-3 h-3 mr-1 fill-current" />
                F1 SPEED &amp; INSIDEEVS LAB
              </span>
            </span>
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              LIVE TELEMETRY BENCHMARKS
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            EV Telemetry &amp; Charging Leaderboard
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
            Real-world 70-mph highway tests, 0–100 km/h GPS timing, and peak DC fast-charging curves. No manufacturer marketing claims—pure verified data.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-[#0d1526] p-1.5 rounded-xl border border-[#202f4a] self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('acceleration')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition whitespace-nowrap ${
              activeTab === 'acceleration'
                ? 'bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black shadow-md shadow-cyan-950/40'
                : 'text-gray-400 hover:text-white hover:bg-[#152035]'
            }`}>
            <Gauge className="w-3.5 h-3.5" />
            <span>0–100 km/h Sprint</span>
          </button>

          <button
            onClick={() => setActiveTab('charging')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition whitespace-nowrap ${
              activeTab === 'charging'
                ? 'bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black shadow-md shadow-cyan-950/40'
                : 'text-gray-400 hover:text-white hover:bg-[#152035]'
            }`}>
            <Zap className="w-3.5 h-3.5" />
            <span>Peak DC Fast Charge</span>
          </button>

          <button
            onClick={() => setActiveTab('highwayRange')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition whitespace-nowrap ${
              activeTab === 'highwayRange'
                ? 'bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black shadow-md shadow-cyan-950/40'
                : 'text-gray-400 hover:text-white hover:bg-[#152035]'
            }`}>
            <Activity className="w-3.5 h-3.5" />
            <span>70-MPH Highway Range</span>
          </button>
        </div>
      </div>

      {/* Content for Tab 1: Acceleration Sprint */}
      {activeTab === 'acceleration' && (
        <div className="pt-6 space-y-3">
          <div className="grid grid-cols-12 text-[10px] uppercase font-mono tracking-wider text-gray-400 px-4 pb-2 border-b border-[#141f33] hidden sm:grid">
            <div className="col-span-1">Pos</div>
            <div className="col-span-4">Vehicle &amp; Inverter</div>
            <div className="col-span-2 text-center">0–100 km/h</div>
            <div className="col-span-2 text-center">Peak Power</div>
            <div className="col-span-1 text-center">Drag (Cd)</div>
            <div className="col-span-2 text-right">Telemetry Benchmark</div>
          </div>

          <div className="space-y-2.5">
            {TELEMETRY_DATA.acceleration.map((car) => (
              <div
                key={car.rank}
                className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-0 p-3.5 sm:p-4 rounded-xl bg-[#0c1322] border border-[#1c293e] hover:border-[#00aeef]/60 hover:bg-[#101b30] transition-all group">
                {/* Pos */}
                <div className="sm:col-span-1 flex items-center space-x-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                    car.rank === 1 ? 'bg-amber-400 text-black shadow-sm shadow-amber-400/50' :
                    car.rank === 2 ? 'bg-cyan-400 text-black shadow-sm shadow-cyan-400/50' :
                    car.rank === 3 ? 'bg-gray-300 text-black' :
                    'bg-[#182337] text-gray-300'
                  }`}>
                    {car.rank}
                  </span>
                  <span className="sm:hidden text-xs font-bold text-gray-400 uppercase">Rank #{car.rank}</span>
                </div>

                {/* Name */}
                <div className="sm:col-span-4 space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                      {car.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 bg-[#162035] px-1.5 py-0.2 rounded border border-[#23334f]">
                      {car.region === 'India' ? '🇮🇳 India' : '🌐 Global'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-gray-400">
                    {car.architecture} • Top Speed: {car.topSpeed}
                  </div>
                </div>

                {/* 0-100 */}
                <div className="sm:col-span-2 sm:text-center flex sm:block items-center justify-between">
                  <span className="text-xs text-gray-400 sm:hidden">0–100 km/h:</span>
                  <span className="text-lg font-black font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40 inline-block">
                    {car.time}
                  </span>
                </div>

                {/* Power */}
                <div className="sm:col-span-2 sm:text-center flex sm:block items-center justify-between">
                  <span className="text-xs text-gray-400 sm:hidden">Peak Output:</span>
                  <span className="text-xs font-bold font-mono text-gray-200">
                    {car.power}
                  </span>
                </div>

                {/* Cd */}
                <div className="sm:col-span-1 sm:text-center flex sm:block items-center justify-between">
                  <span className="text-xs text-gray-400 sm:hidden">Drag Cd:</span>
                  <span className="text-xs font-mono text-gray-300 font-bold">
                    {car.cd}
                  </span>
                </div>

                {/* Badge */}
                <div className="sm:col-span-2 sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1c293e]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-700/50">
                    {car.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content for Tab 2: Charging Rate */}
      {activeTab === 'charging' && (
        <div className="pt-6 space-y-3">
          <div className="grid grid-cols-12 text-[10px] uppercase font-mono tracking-wider text-gray-400 px-4 pb-2 border-b border-[#141f33] hidden sm:grid">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Platform / Architecture</div>
            <div className="col-span-2 text-center">Peak Power</div>
            <div className="col-span-3 text-center">Replenishment Curve</div>
            <div className="col-span-2 text-right">Standard / Scope</div>
          </div>

          <div className="space-y-2.5">
            {TELEMETRY_DATA.charging.map((sys) => (
              <div
                key={sys.rank}
                className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-0 p-3.5 sm:p-4 rounded-xl bg-[#0c1322] border border-[#1c293e] hover:border-[#00aeef]/60 hover:bg-[#101b30] transition-all group">
                {/* Rank */}
                <div className="sm:col-span-1 flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-[#182337] text-gray-300 flex items-center justify-center font-mono font-black text-xs">
                    {sys.rank}
                  </span>
                  <span className="sm:hidden text-xs font-bold text-gray-400 uppercase">Rank #{sys.rank}</span>
                </div>

                {/* Name */}
                <div className="sm:col-span-4 space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                      {sys.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 bg-[#162035] px-1.5 py-0.2 rounded border border-[#23334f]">
                      {sys.region === 'India' ? '🇮🇳 India' : '🌐 Global'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-gray-400">
                    {sys.architecture}
                  </div>
                </div>

                {/* Peak Rate */}
                <div className="sm:col-span-2 sm:text-center flex sm:block items-center justify-between">
                  <span className="text-xs text-gray-400 sm:hidden">Peak kW:</span>
                  <span className="text-base font-black font-mono text-yellow-300 bg-yellow-950/40 px-2.5 py-1 rounded border border-yellow-700/40 inline-block">
                    {sys.rate}
                  </span>
                </div>

                {/* Time 10-80 */}
                <div className="sm:col-span-3 sm:text-center flex sm:block items-center justify-between">
                  <span className="text-xs text-gray-400 sm:hidden">Curve (10-80%):</span>
                  <span className="text-xs font-mono text-gray-300 font-bold">
                    {sys.time1080}
                  </span>
                </div>

                {/* Status */}
                <div className="sm:col-span-2 sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1c293e]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-green-400 bg-green-950/50 px-2 py-1 rounded border border-green-700/40">
                    {sys.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content for Tab 3: InsideEVs 70-MPH Highway Range vs Claimed */}
      {activeTab === 'highwayRange' && (
        <div className="pt-6 space-y-3">
          <div className="grid grid-cols-12 text-[10px] uppercase font-mono tracking-wider text-gray-400 px-4 pb-2 border-b border-[#141f33] hidden sm:grid">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Vehicle Tested</div>
            <div className="col-span-2 text-center">Claimed vs Tested 70-mph</div>
            <div className="col-span-2 text-center">Consumption</div>
            <div className="col-span-1 text-center">Delta</div>
            <div className="col-span-2 text-right">InsideEVs Test Takeaway</div>
          </div>

          <div className="space-y-2.5">
            {TELEMETRY_DATA.highwayRange.map((item) => (
              <div
                key={item.rank}
                className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-0 p-3.5 sm:p-4 rounded-xl bg-[#0c1322] border border-[#1c293e] hover:border-[#00aeef]/60 hover:bg-[#101b30] transition-all group">
                {/* Rank */}
                <div className="sm:col-span-1 flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-[#182337] text-gray-300 flex items-center justify-center font-mono font-black text-xs">
                    {item.rank}
                  </span>
                  <span className="sm:hidden text-xs font-bold text-gray-400 uppercase">Rank #{item.rank}</span>
                </div>

                {/* Name */}
                <div className="sm:col-span-4 space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 bg-[#162035] px-1.5 py-0.2 rounded border border-[#23334f]">
                      {item.region === 'India' ? '🇮🇳 India' : '🌐 Global'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-gray-400">
                    Ambient: {item.temp}
                  </div>
                </div>

                {/* Range */}
                <div className="sm:col-span-2 sm:text-center flex sm:block items-center justify-between">
                  <span className="text-xs text-gray-400 sm:hidden">70-mph Tested:</span>
                  <div>
                    <span className="text-sm font-black font-mono text-green-300 block">
                      {item.tested70}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 line-through">
                      {item.claimed}
                    </span>
                  </div>
                </div>

                {/* Consumption */}
                <div className="sm:col-span-2 sm:text-center flex sm:block items-center justify-between">
                  <span className="text-xs text-gray-400 sm:hidden">Consumption:</span>
                  <span className="text-xs font-mono font-bold text-gray-300">
                    {item.consumption}
                  </span>
                </div>

                {/* Delta */}
                <div className="sm:col-span-1 sm:text-center flex sm:block items-center justify-between">
                  <span className="text-xs text-gray-400 sm:hidden">Variance:</span>
                  <span className="text-xs font-mono font-bold text-rose-400">
                    {item.diff}
                  </span>
                </div>

                {/* Verdict */}
                <div className="sm:col-span-2 sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1c293e]">
                  <span className="text-[11px] text-gray-300 italic block leading-tight">
                    "{item.verdict}"
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="mt-6 pt-4 border-t border-[#162235] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>All tests conducted on closed track or dual-GPS loggers at continuous 70-mph highway cruise.</span>
        </div>
        <span className="font-mono text-[11px] text-cyan-400/80">
          Source: The EV Network Telemetry Lab + InsideEVs Benchmark Standards
        </span>
      </div>
    </section>
  );
}
