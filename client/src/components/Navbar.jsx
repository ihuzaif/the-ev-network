import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, Search, Mail, ShieldCheck, Globe, 
  Menu, X, ExternalLink, Activity
} from 'lucide-react';

export default function Navbar({ activeRegion, onRegionChange, onOpenSearch, onOpenNewsletter }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { name: "All Stories", path: "/" },
    { name: "Cars & SUVs", path: "/category/cars" },
    { name: "Commercial & Fleets", path: "/category/commercial" },
    { name: "Charging & Infra", path: "/category/charging" },
    { name: "Battery Tech", path: "/category/batteries" },
    { name: "Semiconductors", path: "/category/semiconductors" },
    { name: "India EV", path: "/region/india" }
  ];

  return (
    <header className="w-full bg-[#0b0d11] border-b border-[#1f2430] sticky top-0 z-40">
      {/* Top Utility Ribbon */}
      <div className="bg-[#050914] text-gray-400 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-[#111a2c]">
        <div className="flex items-center space-x-4">
          <span className="text-gray-300 font-medium hidden sm:inline">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <span className="hidden md:inline text-gray-600">•</span>
          <span className="hidden md:inline text-cyan-400 font-mono text-[11px] flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-1.5"></span>
            The EV Network Intelligence Active 24/7
          </span>
        </div>

        <div className="flex items-center space-x-5">
          {/* Region Switcher */}
          <div className="flex items-center bg-[#0d1424] px-2 py-0.5 rounded-lg border border-[#1b273d] text-[11px]">
            <Globe className="w-3 h-3 mr-1.5 text-gray-400" />
            <button 
              onClick={() => onRegionChange('All')} 
              className={`px-2 py-0.5 rounded transition ${activeRegion === 'All' ? 'bg-[#00aeef] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
              All
            </button>
            <button 
              onClick={() => onRegionChange('India')} 
              className={`px-2 py-0.5 rounded transition ${activeRegion === 'India' ? 'bg-[#00aeef] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
              India 🇮🇳
            </button>
            <button 
              onClick={() => onRegionChange('Global')} 
              className={`px-2 py-0.5 rounded transition ${activeRegion === 'Global' ? 'bg-[#00aeef] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
              Global 🌐
            </button>
          </div>

          {/* Social Links */}
          <div className="hidden lg:flex items-center space-x-3 text-gray-400 text-xs">
            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-white transition">X</a>
            <a href="https://instagram.com/the.ev.network" target="_blank" rel="noreferrer" className="text-pink-400 hover:text-pink-300 font-semibold transition flex items-center">
              <span>@the.ev.network</span>
            </a>
            <span className="text-gray-600">•</span>
            <span className="text-gray-500 text-[11px]">LinkedIn coming soon</span>
          </div>

          {/* Owner Portal Link */}
          <Link 
            to="/owner" 
            className="flex items-center space-x-1.5 text-xs text-yellow-400 hover:text-yellow-300 font-semibold bg-[#2a2416] px-2.5 py-0.5 rounded border border-yellow-700/50 transition">
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
            <span>Owner Portal</span>
          </Link>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="h-12 sm:h-14 overflow-hidden rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-950/30 group-hover:scale-105 transition-transform shrink-0 flex items-center bg-[#07090e]">
            <img 
              src="/the_ev_network_logo.png" 
              alt="The EV Network" 
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="hidden md:flex flex-col border-l border-[#22293a] pl-3.5">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-pulse"></span>
              GLOBAL &amp; INDIA NETWORK
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
              Electric Vehicles • Batteries • Semiconductors • Infrastructure
            </span>
          </div>
        </Link>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onOpenSearch}
            className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-[#1c2230] transition border border-[#242b3d]"
            title="Search News">
            <Search className="w-4 h-4" />
          </button>

          <button 
            onClick={onOpenNewsletter}
            className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-white px-4 py-2 rounded-xl font-bold text-xs tracking-wide hover:brightness-110 shadow-md shadow-cyan-950/40 transition">
            <Mail className="w-3.5 h-3.5" />
            <span>Get The Dispatch</span>
          </button>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#151e30]">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav className="border-t border-[#121c2e] bg-[#070c18] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <ul className="flex items-center space-x-1 sm:space-x-2 py-1.5 overflow-x-auto text-xs font-semibold uppercase tracking-wider text-gray-300">
            {categories.map((cat, idx) => (
              <li key={idx}>
                <Link 
                  to={cat.path}
                  className="px-3 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-[#0f172a] transition block">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-3 text-xs text-gray-400 font-mono">
            <Link to="/owner" className="flex items-center text-cyan-400 hover:text-cyan-300 transition">
              <Activity className="w-3.5 h-3.5 mr-1 text-cyan-400 animate-pulse" />
              Agent Command Center
            </Link>
          </div>
        </div>
      </nav>

      {/* BBC-Style Live Breaking Alert Ribbon */}
      <div className="bg-[#120509] border-t border-b border-rose-950/60 px-4 sm:px-8 py-1.5 flex items-center justify-between text-xs overflow-hidden">
        <div className="flex items-center space-x-3 w-full overflow-hidden">
          <div className="flex items-center space-x-1.5 bg-rose-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-widest shrink-0 shadow-sm shadow-rose-600/50">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-0.5"></span>
            <span>LIVE BREAKING</span>
          </div>

          <div className="overflow-x-auto whitespace-nowrap flex-1 scrollbar-none text-xs">
            <div className="inline-flex items-center space-x-4 text-gray-200">
              <Link to="/article/xiaomi-su7-ultra-vs-porsche-taycan-turbo-gt-nurburgring-telemetry" className="hover:text-cyan-400 transition">
                🏎️ <span className="font-bold text-white">Xiaomi SU7 Ultra</span> records 6:46 Nürburgring lap time with 900V dual SiC inverters
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/article/india-nhai-megawatt-charging-corridors-commercial-ev-trucks" className="hover:text-cyan-400 transition">
                ⚡ <span className="font-bold text-white">India NHAI</span> greenlights 1.2 MW Megawatt Charging Systems across Golden Quadrilateral
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/article/catl-shenxing-plus-lfp-battery-1000km-range" className="hover:text-cyan-400 transition">
                🔋 <span className="font-bold text-white">CATL Shenxing Plus</span> 1,000 km LFP battery with 4C charging enters production
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/article/insideevs-70-mph-highway-range-test-tata-curvv-ev-vs-mg-zs-ev" className="hover:text-cyan-400 transition">
                🛣️ <span className="font-bold text-white">InsideEVs 70-MPH Test</span>: Tata Curvv EV clocks 378 km highway range in 42°C heat
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#12151d] border-t border-[#232938] px-4 py-4 space-y-3">
          <div className="space-y-1">
            {categories.map((cat, idx) => (
              <Link 
                key={idx}
                to={cat.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-sm font-semibold text-gray-200 hover:bg-[#1d2331]">
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#232938] flex flex-col space-y-2">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenNewsletter(); }}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black py-2.5 rounded-lg font-bold text-xs shadow-md shadow-cyan-950/40">
              <Mail className="w-4 h-4" />
              <span>Subscribe to Newsletter</span>
            </button>
            <Link 
              to="/owner"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 bg-[#2a2416] text-yellow-400 py-2 rounded font-bold text-xs border border-yellow-700/50">
              <ShieldCheck className="w-4 h-4" />
              <span>Owner Admin Suite</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
