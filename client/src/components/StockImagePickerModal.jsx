import React, { useState, useEffect } from 'react';
import { 
  Search, Image as ImageIcon, Check, X, ExternalLink, 
  Sparkles, Globe, Download, Key, ShieldCheck, Filter 
} from 'lucide-react';

const QUICK_TOPICS = [
  { label: "⚡ Track & Supercars", query: "supercar track telemetry" },
  { label: "🔋 Battery Cells & LFP", query: "battery cells gigafactory" },
  { label: "🔌 Fast Charging Hubs", query: "charging station highway" },
  { label: "💻 Silicon Carbide & Chips", query: "semiconductor cleanroom wafer" },
  { label: "🚛 Commercial Freight", query: "commercial electric truck" },
  { label: "🛣️ Highway Range Test", query: "electric vehicle highway" }
];

export default function StockImagePickerModal({ isOpen, onClose, onSelectImage, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    unsplashAccessKey: '',
    pexelsApiKey: '',
    adobeStockClientId: '',
    shutterstockApiToken: ''
  });
  const [saveKeySuccess, setSaveKeySuccess] = useState(false);

  const fetchImages = (searchQuery = query, provider = selectedProvider) => {
    setLoading(true);
    fetch(`/api/images/search?query=${encodeURIComponent(searchQuery || '')}&provider=${encodeURIComponent(provider)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setImages(data.results || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages(initialQuery || '', selectedProvider);
      // Fetch current provider config
      fetch('/api/images/providers')
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            // Keep provider state
          }
        });
    }
  }, [isOpen, initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchImages(query, selectedProvider);
  };

  const handleSelectQuickTopic = (topicQuery) => {
    setQuery(topicQuery);
    fetchImages(topicQuery, selectedProvider);
  };

  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId);
    fetchImages(query, providerId);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    onSelectImage({
      url: customUrl.trim(),
      thumbUrl: customUrl.trim(),
      title: 'Custom Stock Image URL',
      provider: 'Custom Direct Asset',
      author: 'Owner Supplied Asset',
      isPaid: false
    });
    onClose();
  };

  const handleSaveKeys = async (e) => {
    e.preventDefault();
    await fetch('/api/images/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stockImageProvider: selectedProvider === 'all' ? 'unsplash' : selectedProvider,
        stockApiKeys: apiKeys
      })
    });
    setSaveKeySuccess(true);
    setTimeout(() => {
      setSaveKeySuccess(false);
      setShowKeyConfig(false);
      fetchImages(query, selectedProvider);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b101c] border border-[#1d2a42] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#18253a] flex items-center justify-between bg-[#080d17]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#00aeef] flex items-center justify-center text-black font-black shadow-md shadow-cyan-950/50">
              <ImageIcon className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                  Stock Photo &amp; Topic Image Grabber
                </h3>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                  4 PROVIDERS
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Source high-res photography from <span className="text-green-400 font-semibold">Unsplash</span>, <span className="text-green-400 font-semibold">Pexels</span> (Free) or <span className="text-yellow-400 font-semibold">Adobe Stock</span>, <span className="text-yellow-400 font-semibold">Shutterstock</span> (Paid).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141e30] hover:bg-[#1a2740] text-gray-300 hover:text-white border border-[#223350] text-xs font-mono transition">
              <Key className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">API Credentials</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#131b2c] hover:bg-[#1a263d] text-gray-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional API Key Configuration Drawer */}
        {showKeyConfig && (
          <form onSubmit={handleSaveKeys} className="bg-[#090f1b] border-b border-[#1b283d] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Optional Stock API Keys (For Live Real-Time External Queries)
              </span>
              <span className="text-[11px] text-gray-500">
                Leave blank to use zero-config high-res curated CDN pools.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Unsplash Access Key (Free)</label>
                <input
                  type="password"
                  value={apiKeys.unsplashAccessKey}
                  onChange={(e) => setApiKeys({ ...apiKeys, unsplashAccessKey: e.target.value })}
                  placeholder="e.g. client_id=..."
                  className="w-full bg-[#050811] text-xs text-white px-3 py-2 rounded-lg border border-[#1c293d] focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Pexels API Key (Free)</label>
                <input
                  type="password"
                  value={apiKeys.pexelsApiKey}
                  onChange={(e) => setApiKeys({ ...apiKeys, pexelsApiKey: e.target.value })}
                  placeholder="e.g. 563492ad6f917..."
                  className="w-full bg-[#050811] text-xs text-white px-3 py-2 rounded-lg border border-[#1c293d] focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Adobe Stock Client ID (Paid)</label>
                <input
                  type="password"
                  value={apiKeys.adobeStockClientId}
                  onChange={(e) => setApiKeys({ ...apiKeys, adobeStockClientId: e.target.value })}
                  placeholder="e.g. Adobe API Key"
                  className="w-full bg-[#050811] text-xs text-white px-3 py-2 rounded-lg border border-[#1c293d] focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Shutterstock Token (Paid)</label>
                <input
                  type="password"
                  value={apiKeys.shutterstockApiToken}
                  onChange={(e) => setApiKeys({ ...apiKeys, shutterstockApiToken: e.target.value })}
                  placeholder="e.g. Bearer Token"
                  className="w-full bg-[#050811] text-xs text-white px-3 py-2 rounded-lg border border-[#1c293d] focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold px-4 py-1.5 rounded-lg transition shadow">
                {saveKeySuccess ? "Saved Successfully!" : "Save Credentials"}
              </button>
            </div>
          </form>
        )}

        {/* Search Controls & Provider Filters */}
        <div className="p-4 sm:p-6 space-y-3 bg-[#080d18] border-b border-[#162134]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search automotive photography, batteries, charging grids, semiconductors..."
                className="w-full bg-[#0d1424] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#1f2f4a] focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:brightness-110 transition shadow-md shadow-cyan-950/50 flex items-center space-x-1.5 shrink-0">
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          {/* Provider Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-bold">
              <span className="text-gray-500 text-[11px] uppercase mr-1">Source:</span>

              <button
                onClick={() => handleProviderChange('all')}
                className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
                  selectedProvider === 'all'
                    ? 'bg-[#00aeef] text-black font-black'
                    : 'bg-[#101828] text-gray-400 hover:text-white border border-[#1b263b]'
                }`}>
                All Sources
              </button>

              <button
                onClick={() => handleProviderChange('unsplash')}
                className={`px-3 py-1 rounded-lg transition flex items-center space-x-1 whitespace-nowrap ${
                  selectedProvider === 'unsplash'
                    ? 'bg-green-500 text-black font-black'
                    : 'bg-[#101828] text-gray-400 hover:text-white border border-[#1b263b]'
                }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                <span>Unsplash (Free)</span>
              </button>

              <button
                onClick={() => handleProviderChange('pexels')}
                className={`px-3 py-1 rounded-lg transition flex items-center space-x-1 whitespace-nowrap ${
                  selectedProvider === 'pexels'
                    ? 'bg-green-500 text-black font-black'
                    : 'bg-[#101828] text-gray-400 hover:text-white border border-[#1b263b]'
                }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                <span>Pexels (Free)</span>
              </button>

              <button
                onClick={() => handleProviderChange('adobestock')}
                className={`px-3 py-1 rounded-lg transition flex items-center space-x-1 whitespace-nowrap ${
                  selectedProvider === 'adobestock'
                    ? 'bg-yellow-500 text-black font-black'
                    : 'bg-[#101828] text-gray-400 hover:text-white border border-[#1b263b]'
                }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                <span>Adobe Stock (Paid)</span>
              </button>

              <button
                onClick={() => handleProviderChange('shutterstock')}
                className={`px-3 py-1 rounded-lg transition flex items-center space-x-1 whitespace-nowrap ${
                  selectedProvider === 'shutterstock'
                    ? 'bg-yellow-500 text-black font-black'
                    : 'bg-[#101828] text-gray-400 hover:text-white border border-[#1b263b]'
                }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                <span>Shutterstock (Paid)</span>
              </button>
            </div>

            {/* Quick Topic Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] text-gray-400">
              <span className="text-gray-500 mr-1">Topics:</span>
              {QUICK_TOPICS.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectQuickTopic(topic.query)}
                  className="px-2 py-0.5 rounded bg-[#101828] hover:bg-[#16233b] hover:text-cyan-300 border border-[#1e2b40] transition whitespace-nowrap">
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#070b14]">
          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-gray-500">
              Searching stock libraries...
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group bg-[#0d1424] rounded-xl border border-[#1c293e] hover:border-cyan-500/60 overflow-hidden flex flex-col justify-between transition-all shadow-md hover:shadow-cyan-950/40">
                  {/* Image Preview Container */}
                  <div className="relative h-44 bg-[#050811] overflow-hidden">
                    <img
                      src={img.thumbUrl || img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Provider Tag */}
                    <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                        img.isPaid 
                          ? 'bg-yellow-400 text-black' 
                          : 'bg-green-500 text-black'
                      }`}>
                        {img.isPaid ? 'PAID / LICENSED' : 'FREE'}
                      </span>
                      <span className="bg-black/70 backdrop-blur-sm text-gray-200 text-[9px] font-mono px-1.5 py-0.5 rounded border border-white/10">
                        {img.provider}
                      </span>
                    </div>

                    {/* Source link */}
                    <a
                      href={img.downloadUrl || img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-gray-300 hover:text-white transition"
                      title="View original stock source">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Metadata and Selection */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                        {img.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 flex items-center space-x-1 pt-0.5">
                        <span>Photo by</span>
                        <a
                          href={img.authorUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline truncate">
                          {img.author}
                        </a>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectImage({
                          url: img.url,
                          thumbUrl: img.thumbUrl,
                          title: img.title,
                          provider: img.provider,
                          author: img.author,
                          authorUrl: img.authorUrl,
                          isPaid: img.isPaid
                        });
                        onClose();
                      }}
                      className="w-full bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black font-black text-xs py-1.5 rounded-lg hover:brightness-110 transition shadow-sm flex items-center justify-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Use This Image</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-[#0d1422] rounded-2xl border border-[#1b273d] p-8">
              <p className="text-sm text-gray-400">
                No stock images matched query "<span className="text-white font-bold">{query}</span>" in selected provider.
              </p>
              <button
                onClick={() => {
                  setSelectedProvider('all');
                  setQuery('');
                  fetchImages('', 'all');
                }}
                className="text-xs text-cyan-400 font-bold hover:underline">
                Reset filters &amp; show all library
              </button>
            </div>
          )}
        </div>

        {/* Footer: Direct URL paste option */}
        <div className="p-4 sm:p-5 bg-[#080d18] border-t border-[#182338] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto flex-1 max-w-xl">
            <span className="text-xs text-gray-400 shrink-0 font-medium">Or paste custom image URL:</span>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or https://stock.adobe.com/..."
              className="flex-1 bg-[#0d1424] text-xs text-white px-3 py-1.5 rounded-lg border border-[#1f2f4a] focus:border-cyan-400 focus:outline-none font-mono"
            />
            <button
              onClick={handleApplyCustomUrl}
              disabled={!customUrl.trim()}
              className="bg-[#18263d] hover:bg-cyan-500 hover:text-black text-gray-200 text-xs font-bold px-3 py-1.5 rounded-lg transition shrink-0 disabled:opacity-40">
              Apply URL
            </button>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-gray-400 font-mono">
            <span>Free: Unsplash / Pexels</span>
            <span>•</span>
            <span>Paid: Adobe Stock / Shutterstock</span>
          </div>
        </div>
      </div>
    </div>
  );
}
