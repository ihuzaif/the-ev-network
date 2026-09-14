import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { Layers, ArrowLeft, Zap } from 'lucide-react';

export default function CategoryPage() {
  const { cat, reg } = useParams();
  const location = useLocation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const isRegion = location.pathname.startsWith('/region');
  const filterKey = isRegion ? 'region' : 'category';
  const filterValue = isRegion ? (reg || 'India') : (cat || 'Cars');

  const titleMap = {
    cars: "Electric Cars, SUVs & Micromobility",
    commercial: "Electric Commercial Fleets, Trucks & Vans",
    charging: "Megawatt Charging Networks & Grid Infrastructure",
    batteries: "Battery Technologies, Solid-State & Chemistry",
    semiconductors: "Automotive Semiconductors, SiC & GaN Power Modules",
    india: "India Electric Mobility Ecosystem 🇮🇳",
    global: "Global EV Landscape & International OEM News 🌐"
  };

  const displayTitle = titleMap[filterValue.toLowerCase()] || `${filterValue.toUpperCase()} Coverage`;

  useEffect(() => {
    setLoading(true);
    const url = `/api/articles?${filterKey}=${encodeURIComponent(filterValue)}&status=published`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setArticles(data.articles || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    window.scrollTo(0, 0);
  }, [filterValue, filterKey]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div>
        <Link 
          to="/"
          className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to All News</span>
        </Link>
      </div>

      <div className="bg-[#121622] rounded-2xl p-6 sm:p-8 border border-[#232b3c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded shadow">
              {isRegion ? 'Regional Desk' : 'Technology Hub'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {displayTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
            Continuously updated news, technical teardowns, and executive intelligence curated 24/7 by The EV Network agents.
          </p>
        </div>

        <div className="bg-[#181d2a] px-4 py-3 rounded-xl border border-[#273248] text-center font-mono">
          <span className="text-2xl font-black text-white block">{articles.length}</span>
          <span className="text-[11px] text-gray-400 uppercase tracking-wider">Stories Published</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-mono text-xs text-gray-500">
          Loading {filterValue} coverage...
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#131620] rounded-2xl border border-[#222838] p-8 space-y-3">
          <p className="text-sm text-gray-400">
            No published articles found in this category yet.
          </p>
          <Link to="/" className="text-xs text-[#00aeef] hover:underline font-bold inline-block">
            View All News
          </Link>
        </div>
      )}
    </div>
  );
}
