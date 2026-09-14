import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, ArrowUpRight } from 'lucide-react';

export default function ArticleCard({ article }) {
  if (!article) return null;

  return (
    <article className="group bg-[#0e1422] rounded-xl border border-[#1b253b] hover:border-[#00aeef]/60 hover:shadow-lg hover:shadow-cyan-950/30 transition-all flex flex-col overflow-hidden">
      {/* Thumbnail */}
      <Link to={`/article/${article.slug}`} className="relative h-48 overflow-hidden bg-[#0a0c10] block">
        <img 
          src={article.heroImage} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className="bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
            {article.category}
          </span>
          <span className="bg-black/60 backdrop-blur-sm text-gray-200 text-[10px] font-semibold px-2 py-0.5 rounded border border-white/10">
            {article.region}
          </span>
        </div>
        {article.telemetry && article.telemetry.acceleration0100 && article.telemetry.acceleration0100 !== 'N/A' && (
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-cyan-500/40">
            ⚡ {article.telemetry.acceleration0100} (0-100)
          </div>
        )}
        {article.telemetry && (!article.telemetry.acceleration0100 || article.telemetry.acceleration0100 === 'N/A') && article.telemetry.peakKwCharging && (
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-yellow-300 border border-yellow-500/40">
            🔌 {article.telemetry.peakKwCharging}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {article.pillar && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
              🏁 {article.pillar}
            </span>
          )}
          <Link to={`/article/${article.slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#00aeef] transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-[#1d2331] flex items-center justify-between text-[11px] text-gray-400 font-medium">
          <div className="flex items-center space-x-2">
            <span className="text-gray-300 font-semibold">{article.author}</span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1 text-gray-500" />
              {article.readTime || '5 min'}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-gray-500">
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {article.views || 120}
            </span>
            <span className="flex items-center">
              <Heart className="w-3 h-3 mr-1 text-rose-500/70" />
              {article.likes || 15}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
