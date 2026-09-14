import React, { useState, useEffect } from 'react';
import { 
  Mail, Send, Sparkles, Download, Copy, Check, 
  ExternalLink, Users, Image, Palette, CheckCircle2,
  Globe, ShieldCheck 
} from 'lucide-react';
import StockImagePickerModal from '../../components/StockImagePickerModal';

export default function NewsletterStudioTab() {
  const [newsletters, setNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);

  // Graphic customizer state
  const [bannerTitle, setBannerTitle] = useState('Next-Gen 800V Architecture & Solid-State Timelines');
  const [issueNumber, setIssueNumber] = useState(43);
  const [badgeText, setBadgeText] = useState('THE EV NETWORK DISPATCH');

  // Stock Photography Banner State
  const [bannerMode, setBannerMode] = useState('stock'); // 'stock' or 'svg'
  const [stockBanner, setStockBanner] = useState({
    url: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=1600&q=80',
    title: 'Lithium Battery Cells & Energy Storage',
    provider: 'Unsplash (Free)',
    author: 'American Public Power Association',
    isPaid: false
  });
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [grabbingStock, setGrabbingStock] = useState(false);

  const handleAutoGrabNewsletterStock = async () => {
    setGrabbingStock(true);
    try {
      const topic = customSubject || bannerTitle || 'electric vehicles battery charging';
      const res = await fetch(`/api/images/grab-topic?topic=${encodeURIComponent(topic)}&category=Batteries`);
      const data = await res.json();
      if (data.success && data.image) {
        setStockBanner({
          url: data.image.heroImage,
          title: data.image.title,
          provider: data.image.provider,
          author: data.image.author,
          isPaid: data.image.isPaid
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGrabbingStock(false);
    }
  };

  // Newsletter compiler state
  const [customSubject, setCustomSubject] = useState('');
  const [customIntro, setCustomIntro] = useState('');
  const [compiling, setCompiling] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchData = () => {
    fetch('/api/newsletter')
      .then(r => r.json())
      .then(d => {
        if (d.success) setNewsletters(d.newsletters || []);
      });

    fetch('/api/newsletter/subscribers')
      .then(r => r.json())
      .then(d => {
        if (d.success) setSubscribers(d.subscribers || []);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Built-in Dynamic SVG Generator
  const generateSvgPreview = () => {
    return `
<svg width="1200" height="480" viewBox="0 0 1200 480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nlBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#040711"/>
      <stop offset="100%" stop-color="#0d1527"/>
    </linearGradient>
    <linearGradient id="nlCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#00aeef"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="480" fill="url(#nlBg)"/>
  <rect x="0" y="0" width="1200" height="8" fill="url(#nlCyan)"/>

  <!-- Badge -->
  <rect x="80" y="70" width="220" height="32" rx="16" fill="#00aeef"/>
  <text x="190" y="91" fill="#040711" font-family="'Inter', sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="2">⚡ ${badgeText}</text>

  <!-- Issue & Date -->
  <text x="320" y="91" fill="#9ca3af" font-family="'Inter', sans-serif" font-size="14" font-weight="600">ISSUE #${issueNumber} • ${new Date().toLocaleDateString()}</text>

  <!-- Main Title -->
  <text x="80" y="180" fill="#ffffff" font-family="'Inter', sans-serif" font-size="44" font-weight="900" letter-spacing="-1">The EV Network • Mobility &amp; Energy Intelligence</text>
  <text x="80" y="240" fill="#cbd5e1" font-family="'Inter', sans-serif" font-size="24" font-weight="500">${bannerTitle}</text>

  <!-- Graphic Line -->
  <line x1="80" y1="310" x2="1120" y2="310" stroke="#1e293b" stroke-width="1"/>

  <!-- Footer Tags -->
  <text x="80" y="370" fill="#00aeef" font-family="'Inter', sans-serif" font-size="15" font-weight="700">EVs • SOLID-STATE BATTERIES • CHARGING GRIDS • SEMICONDUCTORS • INDIA &amp; GLOBAL</text>
  <text x="80" y="410" fill="#64748b" font-family="'Inter', sans-serif" font-size="13">Curated by The EV Network Autonomous Newsroom | Delivered to ${subscribers.length > 0 ? subscribers.length : 1420} Mobility Executives</text>
</svg>
    `.trim();
  };

  const svgContent = generateSvgPreview();
  const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;

  const handleDownloadSvg = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-ev-network-newsletter-issue-${issueNumber}.svg`;
    a.click();
  };

  const handleCopySvgDataUri = () => {
    navigator.clipboard.writeText(svgDataUri);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  const handleCompileNewsletter = async (e) => {
    e.preventDefault();
    setCompiling(true);
    setSuccessMessage('');

    try {
      const res = await fetch('/api/newsletter/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customSubject: customSubject || null,
          customIntro: customIntro || null,
          heroBanner: bannerMode === 'stock' ? stockBanner.url : svgDataUri
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Dispatched Issue #${data.issue.issueNumber} successfully!`);
        fetchData();
        setCustomSubject('');
        setCustomIntro('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompiling(false);
    }
  };

  const handleExportSubscribers = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Email,SubscribedAt,Status"].concat(
        subscribers.map(s => `${s.email},${s.subscribedAt},${s.active ? 'Active' : 'Inactive'}`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `the-ev-network-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h3 className="text-xl font-black text-white">
          Newsletter Studio &amp; Graphic Production Suite
        </h3>
        <p className="text-xs text-gray-400">
          Craft "The Volt Dispatch", generate custom editorial banners, and manage subscriber dispatches.
        </p>
      </div>

      {/* Section 1: Dynamic Visual Banner Generator & Canva Account Integration */}
      <div className="bg-[#121622] rounded-2xl p-6 sm:p-8 border border-[#263147] space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2638]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#00aeef] text-black font-bold">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Automated Newsletter Graphic &amp; Banner Studio
              </h4>
              <p className="text-xs text-gray-400">
                Source real photography (Unsplash, Pexels, Adobe Stock, Shutterstock) or branded vector SVGs.
              </p>
            </div>
          </div>

          {/* Banner Mode Toggle: Stock Photography vs Vector SVG */}
          <div className="flex bg-[#0a0f1b] p-1 rounded-xl border border-[#1e2a40] text-xs font-bold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setBannerMode('stock')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                bannerMode === 'stock'
                  ? 'bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black font-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}>
              <Image className="w-3.5 h-3.5" />
              <span>Stock Photo Banner</span>
            </button>
            <button
              type="button"
              onClick={() => setBannerMode('svg')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                bannerMode === 'svg'
                  ? 'bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black font-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}>
              <Palette className="w-3.5 h-3.5" />
              <span>Neon Vector SVG</span>
            </button>
          </div>
        </div>

        {/* Live Banner Preview: Stock Photo vs SVG */}
        {bannerMode === 'stock' ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#202f4a] shadow-2xl bg-[#060a14] min-h-[300px] sm:min-h-[360px] flex flex-col justify-between p-6 sm:p-8">
              <img
                src={stockBanner.url}
                alt={stockBanner.title}
                className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-[#040711]/50 to-black/40 pointer-events-none" />

              {/* Top Meta Strip */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                <span className="bg-[#00aeef] text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded shadow-md shadow-cyan-950/50">
                  ⚡ {badgeText} • ISSUE #{issueNumber}
                </span>

                <span className="bg-black/70 backdrop-blur-md text-gray-200 text-[11px] font-mono px-3 py-1 rounded-lg border border-white/10 flex items-center space-x-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${stockBanner.isPaid ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                  <span>{stockBanner.provider}</span>
                  <span>•</span>
                  <span>Photo by {stockBanner.author}</span>
                </span>
              </div>

              {/* Bottom Headline Overlay */}
              <div className="relative z-10 space-y-2 pt-16">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  THE EV NETWORK DISPATCH • GLOBAL &amp; INDIA MOBILITY INTELLIGENCE
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {bannerTitle}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-medium">
                  Delivered to 1,400+ Automotive &amp; Energy Executives across India &amp; Global Markets.
                </p>
              </div>
            </div>

            {/* Stock Sourcing Action Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1424] p-4 rounded-xl border border-[#1e2a40]">
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Active Stock Image: <strong className="text-white">{stockBanner.title}</strong></span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleAutoGrabNewsletterStock}
                  disabled={grabbingStock}
                  className="flex items-center space-x-1.5 bg-[#16233b] hover:bg-[#1f3152] text-cyan-300 text-xs px-3.5 py-2 rounded-lg border border-cyan-800/60 font-bold transition">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{grabbingStock ? "Matching Topic..." : "⚡ Auto-Grab For Topic"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStockModalOpen(true)}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black text-xs px-4 py-2 rounded-lg font-bold hover:brightness-110 transition shadow">
                  <Image className="w-3.5 h-3.5" />
                  <span>Browse 4 Stock Providers</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end space-x-2">
              <button 
                onClick={handleCopySvgDataUri}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1a202e] hover:bg-[#232c3f] border border-[#2b364e] text-xs font-semibold text-gray-300 transition">
                {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSvg ? 'Copied Data URI' : 'Copy Image URI'}</span>
              </button>
              <button 
                onClick={handleDownloadSvg}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0284c7] to-[#00aeef] hover:brightness-110 text-black text-xs font-bold transition shadow-md shadow-cyan-950/40">
                <Download className="w-3.5 h-3.5 font-bold" />
                <span>Download SVG</span>
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#2b3548] shadow-2xl bg-black">
              <div dangerouslySetInnerHTML={{ __html: svgContent }} className="w-full h-auto" />
            </div>
          </div>
        )}

        {/* Customization Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 block">Banner Subtitle / Hook</label>
            <input 
              type="text"
              value={bannerTitle}
              onChange={e => setBannerTitle(e.target.value)}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#00aeef]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 block">Issue Number</label>
            <input 
              type="number"
              value={issueNumber}
              onChange={e => setIssueNumber(e.target.value)}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#00aeef]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 block">Badge Tagline</label>
            <input 
              type="text"
              value={badgeText}
              onChange={e => setBadgeText(e.target.value)}
              className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#00aeef]"
            />
          </div>
        </div>

        {/* Canva Account Integration Panel */}
        <div className="bg-[#181d2a] p-5 rounded-xl border border-[#29344a] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Canva Account Integration &amp; Templates
              </span>
            </div>
            <a 
              href="https://www.canva.com/design/templates?query=tech+newsletter+header" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center text-xs font-bold text-cyan-400 hover:underline">
              <span>Open Canva Web App</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            You can use your Canva account to create custom graphics! Recommended dimensions:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="bg-[#121622] p-2.5 rounded-lg border border-[#252f44]">
              <span className="text-gray-400 block font-sans font-bold">Newsletter Header</span>
              <span className="text-emerald-400 font-bold">1200 x 480 px</span>
            </div>
            <div className="bg-[#121622] p-2.5 rounded-lg border border-[#252f44]">
              <span className="text-gray-400 block font-sans font-bold">Article OG Card</span>
              <span className="text-emerald-400 font-bold">1200 x 630 px</span>
            </div>
            <div className="bg-[#121622] p-2.5 rounded-lg border border-[#252f44]">
              <span className="text-gray-400 block font-sans font-bold">Instagram Post</span>
              <span className="text-emerald-400 font-bold">1080 x 1080 px</span>
            </div>
            <div className="bg-[#121622] p-2.5 rounded-lg border border-[#252f44]">
              <span className="text-gray-400 block font-sans font-bold">Brand Color Hex</span>
              <span className="text-[#00aeef] font-bold">#00AEEF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Compile & Dispatch Newsletter Issue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Compiler Form (Span 7) */}
        <div className="lg:col-span-7 bg-[#121622] rounded-2xl p-6 sm:p-7 border border-[#263147] space-y-5">
          <div className="flex items-center space-x-2">
            <Send className="w-4 h-4 text-[#00aeef]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Compile &amp; Dispatch "The EV Network Dispatch"
            </h4>
          </div>

          {successMessage && (
            <div className="bg-emerald-950/50 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleCompileNewsletter} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 block">Custom Subject Line (Optional)</label>
              <input 
                type="text"
                placeholder="e.g. The EV Network Dispatch #43: India's SiC Semiconductor Breakthrough"
                value={customSubject}
                onChange={e => setCustomSubject(e.target.value)}
                className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00aeef]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 block">Executive Editorial Intro (Optional)</label>
              <textarea 
                rows="3"
                placeholder="Introductory letter from the publisher..."
                value={customIntro}
                onChange={e => setCustomIntro(e.target.value)}
                className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00aeef]"
              />
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                Ready to send to <strong className="text-white">{subscribers.length || 1420}</strong> verified subscribers.
              </span>
              <button 
                type="submit"
                disabled={compiling}
                className="bg-gradient-to-r from-[#0284c7] to-[#00aeef] hover:brightness-110 text-black font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg shadow-cyan-950/40 flex items-center space-x-2">
                <Send className="w-3.5 h-3.5 font-bold" />
                <span>{compiling ? 'Compiling & Dispatching...' : 'Dispatch Issue Now'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Subscriber Management (Span 5) */}
        <div className="lg:col-span-5 bg-[#121622] rounded-2xl p-6 sm:p-7 border border-[#263147] space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f2638]">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                Subscriber List
              </span>
            </div>
            <button 
              onClick={handleExportSubscribers}
              className="text-xs text-cyan-400 hover:underline font-bold">
              Export CSV
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-56">
            {subscribers.map(s => (
              <div key={s.id} className="bg-[#161a25] p-2.5 rounded-lg border border-[#242d40] flex justify-between items-center text-xs">
                <span className="text-gray-200 font-mono truncate max-w-[200px]">{s.email}</span>
                <span className="text-emerald-400 text-[10px] font-bold">Active</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1f2638] text-[11px] text-gray-500 font-mono flex justify-between">
            <span>Total: {subscribers.length} Subscribers</span>
            <span>Syndicated 24/7</span>
          </div>
        </div>
      </div>

      {/* Stock Image Picker Modal */}
      <StockImagePickerModal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        onSelectImage={(img) => {
          setStockBanner({
            url: img.url,
            title: img.title,
            provider: img.provider,
            author: img.author,
            isPaid: img.isPaid
          });
        }}
        initialQuery={customSubject || bannerTitle || 'electric vehicles'}
      />
    </div>
  );
}
