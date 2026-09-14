import React, { useState } from 'react';
import { Calculator, Zap, Fuel, DollarSign, Leaf, Sparkles } from 'lucide-react';

export default function EvCalculator() {
  const [currency, setCurrency] = useState('INR'); // 'INR' or 'USD'
  const [dailyKm, setDailyKm] = useState(45);
  const [iceFuelEconomy, setIceFuelEconomy] = useState(13); // km per liter
  const [fuelPrice, setFuelPrice] = useState(102); // INR per liter or USD per gallon
  const [evRatePerKwh, setEvRatePerKwh] = useState(8); // INR per kWh or USD per kWh

  // Calculations
  const isINR = currency === 'INR';
  const currencySymbol = isINR ? '₹' : '$';

  // Monthly KM
  const monthlyKm = dailyKm * 30;
  
  // Fuel needed per month
  const monthlyFuelLitres = monthlyKm / iceFuelEconomy;
  const monthlyIceCost = monthlyFuelLitres * fuelPrice;

  // EV needed: avg EV consumes 1 kWh per 7.5 km
  const monthlyKwh = monthlyKm / 7.5;
  const monthlyEvCost = monthlyKwh * evRatePerKwh;

  const monthlySavings = Math.max(0, monthlyIceCost - monthlyEvCost);
  const annualSavings = monthlySavings * 12;
  const annualCo2SavedKg = Math.round((monthlyKm * 12 * 0.12)); // approx 120g CO2/km saved

  return (
    <div className="bg-gradient-to-br from-[#121622] to-[#0f121a] rounded-2xl p-6 sm:p-8 border border-[#232a3b] shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f2535]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#00aeef] flex items-center justify-center text-black shadow-md shadow-cyan-950/40">
            <Calculator className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center">
              Interactive EV Running Cost &amp; Savings Calculator
              <span className="ml-2 text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-500/30">
                LIVE TOOL
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Calculate your real-world financial and carbon savings switching from Petrol/Diesel to an Electric Vehicle.
            </p>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex bg-[#121826] p-1 rounded-lg border border-[#202d45] self-start sm:self-auto text-xs font-bold">
          <button 
            onClick={() => { setCurrency('INR'); setFuelPrice(102); setEvRatePerKwh(8); }}
            className={`px-3 py-1 rounded transition ${isINR ? 'bg-[#00aeef] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
            India (₹)
          </button>
          <button 
            onClick={() => { setCurrency('USD'); setFuelPrice(3.60); setEvRatePerKwh(0.14); }}
            className={`px-3 py-1 rounded transition ${!isINR ? 'bg-[#00aeef] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
            Global ($)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Sliders Form (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Daily Commute */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-300">Daily Commute Distance</span>
              <span className="text-white font-mono text-sm">{dailyKm} km / day</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="150" 
              step="5"
              value={dailyKm} 
              onChange={(e) => setDailyKm(Number(e.target.value))}
              className="w-full h-2 bg-[#1b2538] rounded-lg appearance-none cursor-pointer accent-[#00aeef]"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>10 km (Urban commute)</span>
              <span>150 km (Intercity / Fleet)</span>
            </div>
          </div>

          {/* Slider 2: Fuel Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-300">Current Fuel Price ({currencySymbol}/{isINR ? 'Litre' : 'Gallon'})</span>
              <span className="text-white font-mono text-sm">{currencySymbol}{fuelPrice}</span>
            </div>
            <input 
              type="range" 
              min={isINR ? 85 : 2.5} 
              max={isINR ? 125 : 5.5} 
              step={isINR ? 1 : 0.1}
              value={fuelPrice} 
              onChange={(e) => setFuelPrice(Number(e.target.value))}
              className="w-full h-2 bg-[#1b2538] rounded-lg appearance-none cursor-pointer accent-[#00aeef]"
            />
          </div>

          {/* Slider 3: Electricity Tariff */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-300">Electricity Rate ({currencySymbol}/kWh)</span>
              <span className="text-white font-mono text-sm">{currencySymbol}{evRatePerKwh}</span>
            </div>
            <input 
              type="range" 
              min={isINR ? 4 : 0.08} 
              max={isINR ? 15 : 0.35} 
              step={isINR ? 0.5 : 0.01}
              value={evRatePerKwh} 
              onChange={(e) => setEvRatePerKwh(Number(e.target.value))}
              className="w-full h-2 bg-[#1b2538] rounded-lg appearance-none cursor-pointer accent-[#00aeef]"
            />
          </div>
        </div>

        {/* Real-time Results Cards (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-[#171c28] p-5 rounded-xl border border-[#273145] space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Estimated Annual Savings
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
              {currencySymbol}{Math.round(annualSavings).toLocaleString()}
              <span className="text-xs text-gray-400 font-normal ml-1">/ year saved</span>
            </div>
            <p className="text-xs text-gray-400">
              Equivalent to <strong className="text-white">{currencySymbol}{Math.round(monthlySavings).toLocaleString()}</strong> in monthly operating expenses reduction.
            </p>
          </div>

          {/* Breakdown Pills */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#141822] p-3 rounded-lg border border-[#222938]">
              <span className="text-gray-500 block text-[10px] font-semibold">Petrol/Diesel Cost</span>
              <span className="text-rose-400 font-bold font-mono text-sm">
                {currencySymbol}{Math.round(monthlyIceCost).toLocaleString()}/mo
              </span>
            </div>

            <div className="bg-[#141822] p-3 rounded-lg border border-[#222938]">
              <span className="text-gray-500 block text-[10px] font-semibold">EV Charging Cost</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">
                {currencySymbol}{Math.round(monthlyEvCost).toLocaleString()}/mo
              </span>
            </div>
          </div>

          {/* CO2 Emissions saved */}
          <div className="bg-emerald-950/20 border border-emerald-800/30 p-3.5 rounded-xl flex items-center space-x-3 text-xs text-emerald-300">
            <Leaf className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block text-white">{annualCo2SavedKg.toLocaleString()} kg of CO₂ emissions prevented</span>
              <span className="text-[11px] text-emerald-400/80">Equivalent to planting 42 mature trees annually.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
