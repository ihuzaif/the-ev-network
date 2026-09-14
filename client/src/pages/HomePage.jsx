import React, { useState, useEffect } from 'react';
import HeroGrid from '../components/HeroGrid';
import ArticleCard from '../components/ArticleCard';
import TelemetryLeaderboard from '../components/TelemetryLeaderboard';
import CommunityDebates from '../components/CommunityDebates';
import EvCalculator from '../components/EvCalculator';
import CommunityPoll from '../components/CommunityPoll';
import NewsletterBanner from '../components/NewsletterBanner';
import { Layers, Flame, Sparkles, Filter, RefreshCw } from 'lucide-react';

export default function HomePage({ activeRegion, onOpenNewsletter }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    "All",
    "Cars",
    "Commercial",
    "Charging",
    "Batteries",
    "Semiconductors"
  ];

  const fetchArticles = () => {
    setLoading(true);
    let url = '/api/articles?status=published';
    if (selectedCategory !== 'All') {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }
    if (activeRegion !== 'All') {
      url += `&region=${encodeURIComponent(activeRegion)}`;
    }

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setArticles(data.articles || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, activeRegion]);

  const leadArticle = articles.find(a => a.featured) || articles[0];
  const sideArticles = articles.filter(a => a.id !== (leadArticle ? leadArticle.id : null)).slice(0, 3);
  const remainingArticles = articles.filter(a => 
    a.id !== (leadArticle ? leadArticle.id : null) && 
    !sideArticles.some(s => s.id === a.id)
  );

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Grid Section */}
      {leadArticle && (
        <HeroGrid leadArticle={leadArticle} sideArticles={sideArticles} />
      )}

      {/* Formula 1 & InsideEVs Telemetry & Charging Leaderboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <TelemetryLeaderboard />
      </section>

      {/* Main Content & Category Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c2230]">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-6 bg-[#00aeef] rounded-sm shadow-sm shadow-cyan-500/50" />
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              {activeRegion === 'India' ? '🇮🇳 India EV & Tech Corridors' : activeRegion === 'Global' ? '🌐 Global Electric Mobility' : 'Latest Mobility Intelligence'}
            </h2>
            <span className="text-xs font-mono text-gray-400 bg-[#0e1424] px-2 py-0.5 rounded border border-[#1d293d]">
              {articles.length} Stories
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black font-bold shadow-md shadow-cyan-950/40'
                    : 'bg-[#0f1524] text-gray-400 hover:text-white hover:bg-[#152035] border border-[#1e2a40]'
                }`}>
                {cat === 'All' ? 'All Topics' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-mono text-xs">
            Updating newsroom feed...
          </div>
        ) : remainingArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#0d1322] rounded-2xl border border-[#1b253b] p-8 space-y-3">
            <p className="text-sm text-gray-400">
              No published articles match the selected category &amp; region filters.
            </p>
            <button 
              onClick={() => { setSelectedCategory('All'); }}
              className="text-xs text-[#00aeef] hover:underline font-bold">
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Reddit r/electricvehicles Community Pulse & Owner Debates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <CommunityDebates />
      </section>

      {/* Interactive Utilities: EV Calculator & Community Poll */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <EvCalculator />
          </div>
          <div className="lg:col-span-4">
            <CommunityPoll />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterBanner />
    </div>
  );
}
