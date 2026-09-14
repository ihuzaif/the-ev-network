import React, { useState, useEffect } from 'react';
import { 
  Globe, Rss, Map, ShieldCheck, Check, Sparkles, 
  ExternalLink, Search, RefreshCw, Key, CheckCircle2,
  Camera, Image as ImageIcon, CheckCircle, Zap
} from 'lucide-react';

export default function SeoSettingsTab() {
  const [settings, setSettings] = useState(null);
  const [tagline, setTagline] = useState('');
  const [siteName, setSiteName] = useState('');
  const [agentFrequency, setAgentFrequency] = useState(60);
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [rssPreview, setRssPreview] = useState('');
  const [sitemapPreview, setSitemapPreview] = useState('');
  const [previewType, setPreviewType] = useState(null); // 'rss' or 'sitemap'

  // Stock photography provider state
  const [stockImageProvider, setStockImageProvider] = useState('unsplash');
  const [stockApiKeys, setStockApiKeys] = useState({
    unsplashAccessKey: '',
    pexelsApiKey: '',
    adobeStockClientId: '',
    shutterstockApiToken: ''
  });
  const [testImageResult, setTestImageResult] = useState(null);
  const [isTestingImage, setIsTestingImage] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.settings) {
          setSettings(d.settings);
          setSiteName(d.settings.siteName || 'The EV Network');
          setTagline(d.settings.tagline || '');
          setAgentFrequency(d.settings.agentFrequencyMinutes || 60);
          setStockImageProvider(d.settings.stockImageProvider || 'unsplash');
          if (d.settings.stockApiKeys) {
            setStockApiKeys({
              unsplashAccessKey: d.settings.stockApiKeys.unsplashAccessKey || '',
              pexelsApiKey: d.settings.stockApiKeys.pexelsApiKey || '',
              adobeStockClientId: d.settings.stockApiKeys.adobeStockClientId || '',
              shutterstockApiToken: d.settings.stockApiKeys.shutterstockApiToken || ''
            });
          }
        }
      });
  }, []);

  const handleTestStockEngine = async () => {
    setIsTestingImage(true);
    try {
      const res = await fetch('/api/images/grab-topic?topic=Formula+E+Gen3+Racing&category=Cars&region=Global');
      const data = await res.json();
      if (data.success && data.image) {
        setTestImageResult(data.image);
      }
    } catch (err) {
      console.error('Test stock engine failed:', err);
    } finally {
      setIsTestingImage(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const payload = {
      siteName,
      tagline,
      agentFrequencyMinutes: Number(agentFrequency),
      stockImageProvider,
      stockApiKeys
    };
    if (newPassword) {
      payload.ownerPassword = newPassword;
    }

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const d = await res.json();
    if (d.success) {
      setSaved(true);
      setNewPassword('');
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const handleViewRss = async () => {
    const res = await fetch('/feed.xml');
    const text = await res.text();
    setRssPreview(text);
    setPreviewType('rss');
  };

  const handleViewSitemap = async () => {
    const res = await fetch('/sitemap.xml');
    const text = await res.text();
    setSitemapPreview(text);
    setPreviewType('sitemap');
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black text-white">
          SEO Automation &amp; System Configuration
        </h3>
        <p className="text-xs text-gray-400">
          Syndication feeds, Google News indexing, JSON-LD schemas, and 24/7 autonomous run intervals.
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuration saved successfully!</span>
        </div>
      )}

      {/* SEO Engines Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* RSS 2.0 Card */}
        <div className="bg-[#121622] rounded-2xl p-5 border border-[#242c3e] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Rss className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">RSS 2.0 Feed Engine</h4>
            <p className="text-xs text-gray-400">
              Live feed accessible at <code className="text-gray-300 font-mono">/feed.xml</code>. Auto-formats latest 20 articles for Google News and RSS aggregators.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-[#1d2433]">
            <button
              onClick={handleViewRss}
              className="flex-1 text-center py-2 bg-[#191f2c] hover:bg-[#222a3d] text-white text-xs font-bold rounded-lg transition border border-[#2b354a]">
              Inspect XML
            </button>
            <a 
              href="/feed.xml" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 bg-[#191f2c] hover:bg-[#222a3d] text-gray-300 hover:text-white rounded-lg transition border border-[#2b354a]">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* XML Sitemap Card */}
        <div className="bg-[#121622] rounded-2xl p-5 border border-[#242c3e] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Map className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                INDEXED
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Dynamic XML Sitemap</h4>
            <p className="text-xs text-gray-400">
              Dynamic sitemap at <code className="text-gray-300 font-mono">/sitemap.xml</code> mapping all article slugs, category hubs, and daily change frequencies.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-[#1d2433]">
            <button
              onClick={handleViewSitemap}
              className="flex-1 text-center py-2 bg-[#191f2c] hover:bg-[#222a3d] text-white text-xs font-bold rounded-lg transition border border-[#2b354a]">
              Inspect XML
            </button>
            <a 
              href="/sitemap.xml" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 bg-[#191f2c] hover:bg-[#222a3d] text-gray-300 hover:text-white rounded-lg transition border border-[#2b354a]">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Structured Schema Card */}
        <div className="bg-[#121622] rounded-2xl p-5 border border-[#242c3e] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Search className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                JSON-LD
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Google Rich Snippets</h4>
            <p className="text-xs text-gray-400">
              Every article automatically embeds Schema.org <code className="text-gray-300 font-mono">NewsArticle</code> and <code className="text-gray-300 font-mono">FAQPage</code> structured data.
            </p>
          </div>

          <div className="pt-2 border-t border-[#1d2433]">
            <a 
              href="https://search.google.com/test/rich-results" 
              target="_blank" 
              rel="noreferrer"
              className="w-full flex items-center justify-center space-x-1.5 py-2 bg-[#191f2c] hover:bg-[#222a3d] text-cyan-400 hover:text-cyan-300 text-xs font-bold rounded-lg transition border border-[#2b354a]">
              <span>Test on Google Validator</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Stock Photography & Multi-Provider Asset Engine */}
      <div className="bg-[#121622] rounded-2xl p-6 sm:p-8 border border-[#263147] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white flex items-center">
              <Camera className="w-5 h-5 mr-2 text-[#00aeef]" />
              Stock Photography &amp; Asset Intelligence Engines
            </h4>
            <p className="text-xs text-gray-400">
              Automated high-definition photography sourcing for article hero visuals and newsletter dispatches. 
              Supports Free (Unsplash, Pexels) and Paid/Enterprise tiers (Adobe Stock, Shutterstock) with zero-config CDN fallback.
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleTestStockEngine}
              disabled={isTestingImage}
              className="px-3.5 py-1.5 bg-[#192233] hover:bg-[#222f46] text-[#00aeef] border border-[#00aeef]/40 text-xs font-bold rounded-xl transition flex items-center space-x-1.5">
              <Zap className={`w-3.5 h-3.5 ${isTestingImage ? 'animate-spin' : ''}`} />
              <span>{isTestingImage ? 'Resolving Asset...' : 'Test Stock Engine'}</span>
            </button>
          </div>
        </div>

        {/* Test Image Preview Banner if triggered */}
        {testImageResult && (
          <div className="bg-[#0b0e14] border border-[#00aeef]/40 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
            <img 
              src={testImageResult.thumbUrl || testImageResult.heroImage} 
              alt={testImageResult.title} 
              className="w-full md:w-48 h-28 object-cover rounded-lg border border-[#2b3548]"
            />
            <div className="flex-1 space-y-1.5 text-left w-full">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase bg-[#00aeef]/20 text-[#00aeef] px-2 py-0.5 rounded border border-[#00aeef]/40 font-bold">
                  {testImageResult.provider}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  testImageResult.isPaid 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>
                  {testImageResult.isPaid ? 'PAID / ENTERPRISE' : 'FREE TIER'}
                </span>
              </div>
              <h5 className="text-xs font-bold text-white line-clamp-1">{testImageResult.title}</h5>
              <p className="text-[11px] text-gray-400">
                Attribution: <span className="text-gray-200">{testImageResult.author}</span> • Ready for automatic editorial hero assignment.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTestImageResult(null)}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-[#181d2a] rounded">
              Dismiss
            </button>
          </div>
        )}

        {/* 4 Provider Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Unsplash */}
          <div className={`p-4 rounded-xl border transition ${
            stockImageProvider === 'unsplash' 
              ? 'bg-[#15202e] border-[#00aeef]' 
              : 'bg-[#0d1017] border-[#222a3d]'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-white">Unsplash</span>
              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                FREE
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-3">50M+ community photos. Ultra high resolution electric mobility &amp; architecture.</p>
            <div className="text-[10px] text-gray-500">
              {stockApiKeys.unsplashAccessKey ? '● Live API Configured' : '○ Zero-Config CDN Mode'}
            </div>
          </div>

          {/* Pexels */}
          <div className={`p-4 rounded-xl border transition ${
            stockImageProvider === 'pexels' 
              ? 'bg-[#15202e] border-[#00aeef]' 
              : 'bg-[#0d1017] border-[#222a3d]'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-white">Pexels</span>
              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                FREE
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-3">Curated clean energy, manufacturing, logistics, and charging depot captures.</p>
            <div className="text-[10px] text-gray-500">
              {stockApiKeys.pexelsApiKey ? '● Live API Configured' : '○ Zero-Config CDN Mode'}
            </div>
          </div>

          {/* Adobe Stock */}
          <div className={`p-4 rounded-xl border transition ${
            stockImageProvider === 'adobestock' 
              ? 'bg-[#15202e] border-[#00aeef]' 
              : 'bg-[#0d1017] border-[#222a3d]'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-white">Adobe Stock</span>
              <span className="text-[9px] font-mono bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                PAID
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-3">Enterprise premium automotive journalism and motorsports asset library.</p>
            <div className="text-[10px] text-gray-500">
              {stockApiKeys.adobeStockClientId ? '● Client ID Configured' : '○ Curated Editorial CDN'}
            </div>
          </div>

          {/* Shutterstock */}
          <div className={`p-4 rounded-xl border transition ${
            stockImageProvider === 'shutterstock' 
              ? 'bg-[#15202e] border-[#00aeef]' 
              : 'bg-[#0d1017] border-[#222a3d]'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-white">Shutterstock</span>
              <span className="text-[9px] font-mono bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                PAID
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-3">Commercial grade high-speed charging corridors, battery cells &amp; silicon tech.</p>
            <div className="text-[10px] text-gray-500">
              {stockApiKeys.shutterstockApiToken ? '● Token Configured' : '○ Curated Editorial CDN'}
            </div>
          </div>
        </div>

        {/* Active Provider Selector & API Credentials Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1d2537]">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Default Sourcing Engine</label>
            <select
              value={stockImageProvider}
              onChange={e => setStockImageProvider(e.target.value)}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00aeef]">
              <option value="all">⚡ Multi-Provider Simultaneous Search (All 4 Providers)</option>
              <option value="unsplash">Unsplash (Free - Default High-Res)</option>
              <option value="pexels">Pexels (Free - Clean Energy &amp; Depots)</option>
              <option value="adobestock">Adobe Stock (Paid / Enterprise Editorial)</option>
              <option value="shutterstock">Shutterstock (Paid / Enterprise Commercial)</option>
            </select>
            <span className="text-[10px] text-gray-500">Selects primary source when editor agent auto-drafts news stories and weekly newsletters.</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Unsplash API Access Key (Free Tier)</label>
            <input 
              type="text"
              placeholder="Optional - e.g. YOUR_UNSPLASH_ACCESS_KEY"
              value={stockApiKeys.unsplashAccessKey}
              onChange={e => setStockApiKeys({ ...stockApiKeys, unsplashAccessKey: e.target.value })}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00aeef] font-mono"
            />
            <span className="text-[10px] text-gray-500">From <a href="https://unsplash.com/developers" target="_blank" rel="noreferrer" className="text-[#00aeef] underline">unsplash.com/developers</a></span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Pexels API Key (Free Tier)</label>
            <input 
              type="text"
              placeholder="Optional - e.g. YOUR_PEXELS_API_KEY"
              value={stockApiKeys.pexelsApiKey}
              onChange={e => setStockApiKeys({ ...stockApiKeys, pexelsApiKey: e.target.value })}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00aeef] font-mono"
            />
            <span className="text-[10px] text-gray-500">From <a href="https://www.pexels.com/api" target="_blank" rel="noreferrer" className="text-[#00aeef] underline">pexels.com/api</a></span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Adobe Stock Client ID (Paid / Enterprise)</label>
            <input 
              type="text"
              placeholder="Optional - e.g. YOUR_ADOBE_CLIENT_ID"
              value={stockApiKeys.adobeStockClientId}
              onChange={e => setStockApiKeys({ ...stockApiKeys, adobeStockClientId: e.target.value })}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00aeef] font-mono"
            />
            <span className="text-[10px] text-gray-500">From Adobe Developer Console Stock API</span>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-gray-300 block">Shutterstock API Bearer Token (Paid / Enterprise)</label>
            <input 
              type="text"
              placeholder="Optional - e.g. YOUR_SHUTTERSTOCK_BEARER_TOKEN"
              value={stockApiKeys.shutterstockApiToken}
              onChange={e => setStockApiKeys({ ...stockApiKeys, shutterstockApiToken: e.target.value })}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00aeef] font-mono"
            />
            <span className="text-[10px] text-gray-500">From Shutterstock Developer Portal</span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-[#121622] rounded-2xl p-6 sm:p-8 border border-[#263147] space-y-6">
        <h4 className="text-base font-bold text-white flex items-center">
          <ShieldCheck className="w-4 h-4 mr-2 text-yellow-400" />
          Newsroom Core Parameters
        </h4>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Platform Name</label>
            <input 
              type="text"
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00aeef]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Editorial Tagline</label>
            <input 
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00aeef]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">24/7 Agent Run Frequency (Minutes)</label>
            <input 
              type="number"
              min="5"
              max="1440"
              value={agentFrequency}
              onChange={e => setAgentFrequency(e.target.value)}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00aeef]"
            />
            <span className="text-[10px] text-gray-500">Autonomous agents will execute discovery &amp; drafting every {agentFrequency} minutes.</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 block">Change Owner Password</label>
            <input 
              type="password"
              placeholder="Leave blank to keep current password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00aeef]"
            />
          </div>

          <div className="sm:col-span-2 pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#0284c7] to-[#00aeef] hover:brightness-110 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/40 transition">
              Save Settings
            </button>
          </div>
        </form>
      </div>

      {/* XML Code Preview Drawer/Modal */}
      {previewType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f121a] border border-[#2b3548] rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-[#202738]">
              <h4 className="text-sm font-bold text-white font-mono uppercase">
                {previewType === 'rss' ? 'RSS 2.0 Feed Output (/feed.xml)' : 'Google XML Sitemap Output (/sitemap.xml)'}
              </h4>
              <button 
                onClick={() => setPreviewType(null)}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-[#181d2a]">
                Close
              </button>
            </div>

            <div className="overflow-y-auto flex-1 bg-[#090b10] p-4 rounded-xl border border-[#1e2535] font-mono text-xs text-emerald-400 whitespace-pre">
              {previewType === 'rss' ? rssPreview : sitemapPreview}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
