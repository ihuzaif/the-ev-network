import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Zap, Flame, ArrowRight } from 'lucide-react';

export default function HeroGrid({ leadArticle, sideArticles = [] }) {
  if (!leadArticle) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
        <h2 className="text-xs uppercase tracking-widest font-extrabold text-gray-200">
          Top Stories &amp; Breaking Technology
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Lead Story Card (Span 7 or 8) */}
        <div className="lg:col-span-8 group relative rounded-2xl overflow-hidden bg-[#0a101d] border border-[#172338] hover:border-cyan-500/50 transition-all shadow-xl flex flex-col justify-end min-h-[420px] sm:min-h-[480px]">
          {/* Background Image / SVG Banner */}
          <div className="absolute inset-0 z-0">
            <img 
              src={leadArticle.heroImage} 
              alt={leadArticle.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-[#040711]/70 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 p-6 sm:p-8 space-y-3">
            <div className="flex items-center space-x-2.5">
              <span className="bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-white text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm shadow-cyan-950/40">
                ⚡ {leadArticle.category}
              </span>
              <span className="bg-[#121c2e]/80 text-gray-200 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#20304a]">
                📍 {leadArticle.region}
              </span>
              {leadArticle.featured && (
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border border-cyan-500/40">
                  FEATURED
                </span>
              )}
            </div>

            <Link to={`/article/${leadArticle.slug}`}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white group-hover:text-cyan-300 transition-colors leading-tight">
                {leadArticle.title}
              </h1>
            </Link>

            <p className="text-sm sm:text-base text-gray-300 line-clamp-2 leading-relaxed">
              {leadArticle.summary}
            </p>

            <div className="flex items-center space-x-4 pt-2 text-xs text-gray-400 font-medium">
              <span className="text-white font-semibold">{leadArticle.author}</span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-gray-500" />
                {leadArticle.readTime || '5 min read'}
              </span>
              <span>•</span>
              <span className="text-gray-400">
                {new Date(leadArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Side Trending Stack (Span 4) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-[#12151d] px-4 py-2.5 rounded-lg border border-[#212736] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center">
              <Zap className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
              Trending Dispatches
            </span>
            <span className="text-[10px] font-mono text-gray-500">AUTONOMOUS DISCOVERY</span>
          </div>

          <div className="flex-1 flex flex-col justify-between space-y-3">
            {sideArticles.slice(0, 3).map((article, idx) => (
              <Link 
                key={article.id || idx}
                to={`/article/${article.slug}`}
                className="group flex space-x-3.5 p-3.5 rounded-xl bg-[#0e1422] border border-[#1b253b] hover:border-[#00aeef]/60 hover:bg-[#121c2e] transition-all">
                <div className="w-24 h-20 sm:w-28 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-[#0c0e14] relative">
                  <img 
                    src={article.heroImage} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-1 left-1 bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                    {article.category}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00aeef] transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] text-gray-400 pt-1">
                    <span>{article.region}</span>
                    <span>•</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
