import React, { useState, useEffect } from 'react';
import { 
  Share2, Copy, Check, Send, ExternalLink, 
  ChevronRight, ChevronLeft, Sparkles, CheckCircle2 
} from 'lucide-react';
import { TwitterIcon, LinkedinIcon, InstagramIcon } from '../../components/SocialIcons';

export default function SocialHubTab() {
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [activePlatform, setActivePlatform] = useState('x'); // 'x', 'linkedin', 'instagram'
  const [carouselSlide, setCarouselSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.articles && d.articles.length > 0) {
          setArticles(d.articles);
          setSelectedArticleId(d.articles[0].id);
        }
      });
  }, []);

  const article = articles.find(a => a.id === selectedArticleId);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatch = async (platform, copy) => {
    try {
      const res = await fetch('/api/social/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: `${platform}-${article.id}`,
          platform,
          copy
        })
      });
      const data = await res.json();
      if (data.success) {
        setDispatched(true);
        setTimeout(() => setDispatched(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!article) {
    return <div className="text-gray-400 font-mono text-xs">Loading social campaigns...</div>;
  }

  const social = article.social || {
    x: `⚡ BREAKING: ${article.title}\n\n• Analysis & Specs: https://theevnetwork.com/article/${article.slug}\n\n#EV #${article.category} #TheEVNetwork`,
    linkedin: `Strategic Industry Intelligence: ${article.title}\n\nRead our technical breakdown at The EV Network: https://theevnetwork.com/article/${article.slug}`,
    instagram: `⚡ ${article.title}\n\nSwipe through for specs! 👉\n\nLink in bio. @the.ev.network #TheEVNetwork #EV`
  };

  const carouselSlides = (article.social && article.social.instagramCarousel) || [
    { slide: 1, type: "cover", headline: article.title, badge: `${article.category} • ${article.region}` },
    { slide: 2, type: "takeaway", headline: "Core Breakthrough", text: article.summary },
    { slide: 3, type: "specs", headline: "Technical Specs", text: article.specs ? article.specs.map(s => `${s.label}: ${s.value}`).join('\n') : "800V Architecture" },
    { slide: 4, type: "market", headline: "Market Implications", text: `Why this alters ${article.region} mobility.` },
    { slide: 5, type: "cta", headline: "Read Full Report", text: "Link in bio to read on The EV Network." }
  ];

  return (
    <div className="space-y-8">
      {/* Header & Article Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white">
            Social Media Command Hub (X • LinkedIn • Instagram)
          </h3>
          <p className="text-xs text-gray-400">
            Autonomous multi-platform campaigns generated automatically for each article.
          </p>
        </div>

        {/* Article Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-gray-300">Select Story:</label>
          <select 
            value={selectedArticleId}
            onChange={e => { setSelectedArticleId(e.target.value); setCarouselSlide(0); }}
            className="bg-[#141822] border border-[#273248] rounded-xl px-3 py-2 text-xs text-white max-w-xs truncate focus:outline-none focus:border-[#00aeef]">
            {articles.map(a => (
              <option key={a.id} value={a.id}>
                [{a.category}] {a.title.substring(0, 40)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {dispatched && (
        <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs flex items-center space-x-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4" />
          <span>Campaign successfully pushed to social automation webhook!</span>
        </div>
      )}

      {/* Platform Tabs */}
      <div className="flex bg-[#121622] p-1.5 rounded-2xl border border-[#232b3d] max-w-md text-xs font-bold">
        <button
          onClick={() => setActivePlatform('x')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl transition ${
            activePlatform === 'x' ? 'bg-[#00aeef] text-black font-black shadow' : 'text-gray-400 hover:text-white'
          }`}>
          <TwitterIcon className="w-4 h-4" />
          <span>X / Twitter</span>
        </button>

        <button
          onClick={() => setActivePlatform('linkedin')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl transition ${
            activePlatform === 'linkedin' ? 'bg-[#0a66c2] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}>
          <LinkedinIcon className="w-4 h-4" />
          <span>LinkedIn</span>
        </button>

        <button
          onClick={() => setActivePlatform('instagram')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl transition ${
            activePlatform === 'instagram' ? 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}>
          <InstagramIcon className="w-4 h-4" />
          <span>Instagram</span>
        </button>
      </div>

      {/* Platform Card View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visual Live Mockup (Span 7) */}
        <div className="lg:col-span-7">
          {activePlatform === 'x' && (
            <div className="bg-[#000000] rounded-2xl p-6 border border-[#2f3336] space-y-4 shadow-2xl font-sans">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#00aeef] shrink-0 bg-[#111]">
                  <img src="/the_ev_network_icon.png" alt="The EV Network" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5 text-sm font-bold text-white">
                    <span>The EV Network</span>
                    <span className="text-cyan-400 text-xs">✓</span>
                    <span className="text-gray-500 text-xs font-normal">@the.ev.network</span>
                  </div>
                  <span className="text-gray-500 text-[11px]">Electric Mobility &amp; Battery Tech Media</span>
                </div>
              </div>

              <div className="text-sm text-gray-100 whitespace-pre-line leading-relaxed">
                {social.x}
              </div>

              <div className="rounded-xl overflow-hidden border border-[#2f3336] bg-[#111]">
                <img src={article.heroImage} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-3 bg-[#111] border-t border-[#2f3336]">
                  <span className="text-[11px] text-gray-500 block uppercase">theevnetwork.com</span>
                  <span className="text-xs font-bold text-white line-clamp-1">{article.title}</span>
                </div>
              </div>
            </div>
          )}

          {activePlatform === 'linkedin' && (
            <div className="bg-[#1b1f28] rounded-2xl p-6 border border-[#2c374d] space-y-4 shadow-2xl font-sans">
              <div className="flex items-center space-x-3 pb-3 border-b border-[#283449]">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#00aeef] shrink-0 bg-[#111]">
                  <img src="/the_ev_network_icon.png" alt="The EV Network" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">The EV Network</span>
                  <span className="text-gray-400 text-xs">Electric Mobility &amp; Semiconductor Media • Verified Network</span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-gray-200 whitespace-pre-line leading-relaxed">
                {social.linkedin}
              </div>

              <div className="rounded-xl overflow-hidden border border-[#2c374d]">
                <img src={article.heroImage} alt={article.title} className="w-full h-52 object-cover" />
              </div>
            </div>
          )}

          {activePlatform === 'instagram' && (
            <div className="bg-[#141822] rounded-2xl p-6 border border-[#283347] space-y-4 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-bold text-white flex items-center">
                  <InstagramIcon className="w-3.5 h-3.5 mr-1 text-pink-400 inline" />
                  Interactive Carousel Card Preview (@the.ev.network)
                </span>
                <span>Slide {carouselSlide + 1} of {carouselSlides.length}</span>
              </div>

              {/* Instagram Square Slide (1:1 Ratio) */}
              <div className="aspect-square w-full max-w-md mx-auto rounded-2xl bg-gradient-to-br from-[#040711] via-[#0b1526] to-[#060c18] border border-cyan-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0284c7] to-[#00aeef]" />

                {/* Top Badge */}
                <div className="flex justify-between items-center">
                  <span className="bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow">
                    {carouselSlides[carouselSlide].badge || article.category}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-[#00aeef]">
                      <img src="/the_ev_network_icon.png" alt="EVN" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white">
                      THE EV <span className="text-[#00aeef]">NETWORK</span>
                    </span>
                  </div>
                </div>

                {/* Slide Center Content */}
                <div className="space-y-3 my-auto text-center">
                  <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {carouselSlides[carouselSlide].headline}
                  </h4>
                  {carouselSlides[carouselSlide].text && (
                    <p className="text-xs sm:text-sm text-gray-300 whitespace-pre-line leading-relaxed max-w-xs mx-auto">
                      {carouselSlides[carouselSlide].text}
                    </p>
                  )}
                </div>

                {/* Slide Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-[#222b3d] text-[10px] text-gray-400 font-mono">
                  <span>SWIPE FOR MORE 👉</span>
                  <span className="text-cyan-400 font-bold">@the.ev.network</span>
                </div>
              </div>

              {/* Slide Stepper Controls */}
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  disabled={carouselSlide === 0}
                  onClick={() => setCarouselSlide(prev => Math.max(0, prev - 1))}
                  className="p-2 rounded-lg bg-[#1a202d] text-gray-300 hover:text-white disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex space-x-1.5">
                  {carouselSlides.map((_, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setCarouselSlide(idx)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition ${
                        carouselSlide === idx ? 'bg-[#00aeef] w-5' : 'bg-[#29344a]'
                      }`}
                    />
                  ))}
                </div>
                <button
                  disabled={carouselSlide === carouselSlides.length - 1}
                  onClick={() => setCarouselSlide(prev => Math.min(carouselSlides.length - 1, prev + 1))}
                  className="p-2 rounded-lg bg-[#1a202d] text-gray-300 hover:text-white disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Copywriting & Webhook Push Controls (Span 5) */}
        <div className="lg:col-span-5 bg-[#121622] rounded-2xl p-6 sm:p-7 border border-[#273248] space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2638]">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Autonomous Draft Review
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                SEO &amp; VIRAL OPTIMIZED
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 block">
                Social Copywriting Buffer
              </label>
              <textarea 
                rows="10"
                value={
                  activePlatform === 'x' ? social.x :
                  activePlatform === 'linkedin' ? social.linkedin :
                  social.instagram
                }
                onChange={e => {
                  const val = e.target.value;
                  setSocial(prev => ({
                    ...prev,
                    [activePlatform]: val
                  }));
                }}
                className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-xs text-white placeholder-gray-500 font-mono leading-relaxed focus:outline-none focus:border-[#00aeef]"
              />
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#1f2638]">
            <button
              onClick={() => handleCopyPost(
                activePlatform === 'x' ? social.x :
                activePlatform === 'linkedin' ? social.linkedin :
                social.instagram
              )}
              className="w-full flex items-center justify-center space-x-2 bg-[#1a202d] hover:bg-[#222a3b] border border-[#29344a] text-white font-bold py-2.5 rounded-xl text-xs transition">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : `Copy ${activePlatform.toUpperCase()} Post`}</span>
            </button>

            <button
              onClick={() => handleDispatch(
                activePlatform,
                activePlatform === 'x' ? social.x :
                activePlatform === 'linkedin' ? social.linkedin :
                social.instagram
              )}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#0284c7] to-[#00aeef] hover:brightness-110 text-black font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-cyan-950/40">
              <Send className="w-3.5 h-3.5 font-bold" />
              <span>Trigger {activePlatform.toUpperCase()} Automation Webhook</span>
            </button>

            <span className="text-[11px] text-gray-500 block text-center">
              Compatible with Buffer, Zapier, Make.com, or Native Graph APIs.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
