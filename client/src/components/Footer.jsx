import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Rss, Map, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#08090d] border-t border-[#1a1f2b] text-gray-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1c2230]">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 overflow-hidden rounded-lg border border-cyan-500/20 shrink-0 bg-[#07090e]">
                <img src="/the_ev_network_logo.png" alt="The EV Network" className="h-full w-auto object-contain" />
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              The premier digital media network dedicated to electric mobility, battery chemistry, semiconductors, and high-voltage charging across India and international markets.
            </p>
            <div className="pt-1 flex flex-col space-y-2">
              <a 
                href="https://instagram.com/the.ev.network" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-pink-400 hover:text-pink-300 font-bold flex items-center">
                <span>Instagram: @the.ev.network</span>
              </a>
              <span className="inline-flex items-center text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Autonomous Newsroom 24/7
              </span>
            </div>
          </div>

          {/* Topics Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Coverage Focus</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/category/cars" className="hover:text-white transition">Electric Cars &amp; SUVs</Link></li>
              <li><Link to="/category/commercial" className="hover:text-white transition">Commercial Trucks &amp; Fleets</Link></li>
              <li><Link to="/category/charging" className="hover:text-white transition">Megawatt Charging &amp; V2G</Link></li>
              <li><Link to="/category/batteries" className="hover:text-white transition">Solid-State &amp; LFP Batteries</Link></li>
              <li><Link to="/category/semiconductors" className="hover:text-white transition">Silicon Carbide (SiC) &amp; GaN</Link></li>
              <li><Link to="/region/india" className="text-rose-400 hover:text-rose-300 transition">India EV Spotlight 🇮🇳</Link></li>
            </ul>
          </div>

          {/* SEO & Syndication Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Syndication &amp; SEO</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/feed.xml" target="_blank" rel="noreferrer" className="flex items-center hover:text-white transition">
                  <Rss className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                  <span>RSS 2.0 News Feed</span>
                  <ArrowUpRight className="w-3 h-3 ml-1 text-gray-500" />
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="flex items-center hover:text-white transition">
                  <Map className="w-3.5 h-3.5 mr-1.5 text-cyan-500" />
                  <span>Google XML Sitemap</span>
                  <ArrowUpRight className="w-3 h-3 ml-1 text-gray-500" />
                </a>
              </li>
              <li>
                <span className="text-gray-500 text-[11px] block mt-1">
                  Structured JSON-LD NewsArticle schema active on all stories.
                </span>
              </li>
            </ul>
          </div>

          {/* Owner & Community Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Owner &amp; Editorial</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/owner" className="flex items-center text-yellow-400 hover:text-yellow-300 font-semibold transition">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  <span>Owner Admin Portal</span>
                </Link>
              </li>
              <li>
                <span className="text-gray-500 text-[11px]">
                  Draft verification, Canva templates, newsletter studio &amp; agent logs.
                </span>
              </li>
              <li className="pt-2">
                <a 
                  href="https://electricdrives.tv" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-gray-500 hover:text-gray-300 text-[11px] flex items-center">
                  Inspired by ElectricDrives.tv
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} The EV Network. Autonomous EV Intelligence. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Editorial Standards</span>
            <span>•</span>
            <span>Advertise with Us</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
