import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

export default function MarketTicker() {
  const [ticker, setTicker] = useState([
    { symbol: "TSLA", name: "Tesla Inc", price: 248.50, change: "+3.2%", isPositive: true },
    { symbol: "BYD", name: "BYD Auto", price: 34.15, change: "+1.8%", isPositive: true },
    { symbol: "TATAMTR", name: "Tata Motors EV", price: 982.40, change: "+4.1%", isPositive: true },
    { symbol: "M&M", name: "Mahindra Electric", price: 2840.00, change: "+2.4%", isPositive: true },
    { symbol: "RIVN", name: "Rivian", price: 14.80, change: "-0.9%", isPositive: false },
    { symbol: "NVDA", name: "Nvidia Thor", price: 128.90, change: "+2.6%", isPositive: true },
    { symbol: "LITHIUM", name: "Li Carbonate/T", price: 10450, change: "+1.2%", isPositive: true, unit: "$" },
    { symbol: "NICKEL", name: "Nickel Battery", price: 16200, change: "-0.4%", isPositive: false, unit: "$" },
    { symbol: "LFP CELL", name: "Cell Price/kWh", price: 62.50, change: "-3.8%", isPositive: false, unit: "$" }
  ]);

  useEffect(() => {
    fetch('/api/market-ticker')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.ticker) {
          setTicker(data.ticker);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#050914] border-b border-[#121c2e] text-xs font-mono py-2 overflow-hidden flex items-center select-none">
      <div className="flex items-center px-3 bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-white font-bold tracking-wider uppercase text-[10px] py-1 rounded ml-2 mr-3 z-10 shrink-0 shadow-sm shadow-cyan-950/50">
        <Zap className="w-3 h-3 mr-1 fill-current text-white animate-pulse" />
        Live EV &amp; Battery Index
      </div>

      <div className="flex overflow-hidden relative w-full">
        <div className="animate-ticker flex items-center space-x-6 whitespace-nowrap">
          {ticker.concat(ticker).map((item, idx) => (
            <div key={idx} className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors cursor-default">
              <span className="font-bold text-gray-100">{item.symbol}</span>
              <span className="text-gray-400 text-[11px]">{item.name}</span>
              <span className="text-white font-semibold">
                {item.unit || ""}{item.price.toLocaleString()}
              </span>
              <span className={`inline-flex items-center font-medium ${item.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {item.change}
              </span>
              <span className="text-gray-600 pl-3">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
