import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Clock, ArrowRight, Zap } from 'lucide-react';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/articles?search=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setResults(data.articles || []);
          }
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#121622] border border-[#2b3548] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2c45]">
          <div className="flex items-center space-x-2 text-white font-bold text-sm uppercase tracking-wider">
            <Search className="w-4 h-4 text-[#00aeef]" />
            <span>Search The EV Network Intelligence</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg bg-[#141e30] text-gray-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <input 
            type="text"
            autoFocus
            placeholder="Search EV models, batteries, chips, charging grids, Tata, Tesla..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#080d17] border border-[#1d2b42] rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00aeef] transition"
          />
          <Search className="w-4 h-4 text-cyan-500 absolute left-4 top-3.5" />
        </div>

        {/* Quick Tag Suggestions */}
        {!query && (
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
              Suggested Topics
            </span>
            <div className="flex flex-wrap gap-2">
              {["800V Architecture", "CATL LFP", "Silicon Carbide", "Tata Motors", "Megawatt Charging", "Solid State", "India EV"].map((tag, idx) => (
                <button 
                  key={idx}
                  onClick={() => setQuery(tag)}
                  className="px-2.5 py-1 rounded-lg bg-[#181e2b] hover:bg-[#202738] text-gray-300 hover:text-white text-xs border border-[#273248] transition">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto space-y-2 pt-2">
          {loading && (
            <div className="text-center py-6 text-xs text-gray-500 font-mono">
              Scanning newsroom articles...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-6 text-xs text-gray-400">
              No matching articles found for "{query}".
            </div>
          )}

          {!loading && results.map((article) => (
            <Link 
              key={article.id}
              to={`/article/${article.slug}`}
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl bg-[#0d1424] hover:bg-[#121c32] border border-[#1b253b] hover:border-[#00aeef]/60 transition group">
              <div className="space-y-1 pr-4">
                <div className="flex items-center space-x-2">
                  <span className="bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow">
                    {article.category}
                  </span>
                  <span className="text-gray-400 text-[10px] font-medium">
                    {article.region}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00aeef] transition-colors line-clamp-1">
                  {article.title}
                </h4>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#00aeef] group-hover:translate-x-1 transition shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
