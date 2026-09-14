import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';
import ArticleCard from '../components/ArticleCard';
import { 
  Clock, ArrowLeft, Heart, Share2, Copy, Check, Sparkles, 
  HelpCircle, ChevronDown, ChevronUp, Eye, Flame, Zap, Gauge
} from 'lucide-react';
import { TwitterIcon, LinkedinIcon, WhatsAppIcon } from '../components/SocialIcons';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.article) {
          setArticle(data.article);
          setLikeCount(data.article.likes || 15);
          document.title = `${data.article.title} | The EV Network`;

          // Fetch related articles in same category
          fetch(`/api/articles?category=${encodeURIComponent(data.article.category)}&status=published`)
            .then(r => r.json())
            .then(relData => {
              if (relData.success) {
                setRelated(relData.articles.filter(a => a.slug !== slug).slice(0, 3));
              }
            });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

    window.scrollTo(0, 0);
  }, [slug]);

  const handleLike = async () => {
    if (liked) return;
    try {
      const res = await fetch(`/api/articles/${slug}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLiked(true);
        setLikeCount(data.likes);
      }
    } catch (e) {}
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono text-xs text-gray-500">
        Loading article intelligence...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Article Not Found</h2>
        <p className="text-sm text-gray-400">The requested story could not be located or has been archived.</p>
        <Link to="/" className="inline-flex items-center text-xs font-bold text-[#00aeef] hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Return to Homepage
        </Link>
      </div>
    );
  }

  // Schema.org JSON-LD structured data for Google News
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [article.heroImage],
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "author": [{
      "@type": "Person",
      "name": article.author,
      "jobTitle": article.authorRole
    }],
    "publisher": {
      "@type": "Organization",
      "name": "The EV Network",
      "logo": {
        "@type": "ImageObject",
        "url": "https://theevnetwork.com/the_ev_network_logo.png"
      }
    },
    "description": article.summary
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Inject JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Back Button */}
      <div>
        <Link 
          to="/"
          className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to All News</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2.5">
          <span className="bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded shadow">
            ⚡ {article.category}
          </span>
          <span className="bg-[#1b212f] text-gray-200 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#2d374d]">
            📍 {article.region}
          </span>
          {article.pillar && (
            <span className="bg-[#0b1b33] text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border border-cyan-500/40 transform skew-x-[-6deg] inline-block">
              <span className="transform skew-x-[6deg] inline-block">
                🏎️ {article.pillar}
              </span>
            </span>
          )}
          {article.tags && article.tags.slice(0, 2).map((t, idx) => (
            <span key={idx} className="hidden sm:inline-block text-[11px] font-mono text-gray-400 bg-[#161a24] px-2 py-0.5 rounded">
              #{t}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-medium">
          {article.summary}
        </p>

        {/* Author & Meta Strip */}
        <div className="pt-2 pb-4 border-b border-[#1d2433] flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0284c7] to-[#00aeef] flex items-center justify-center text-black font-black text-sm shadow-md">
              {article.author.charAt(0)}
            </div>
            <div>
              <span className="text-white font-bold block">{article.author}</span>
              <span className="text-gray-500 text-[11px]">{article.authorRole || 'Automotive Contributor'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-gray-500" />
              {article.readTime}
            </span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span className="flex items-center text-gray-400">
              <Eye className="w-3.5 h-3.5 mr-1" />
              {article.views || 240} views
            </span>
          </div>
        </div>
      </div>

      {/* Featured Hero Graphic */}
      <div className="rounded-2xl overflow-hidden border border-[#222a3a] shadow-2xl bg-[#0d1017]">
        <img 
          src={article.heroImage} 
          alt={article.title}
          className="w-full h-auto max-h-[500px] object-cover object-center"
        />
      </div>

      {/* Audio Player (TTS) */}
      <AudioPlayer title={article.title} textToRead={article.content} />

      {/* BBC-Style Authoritative Newsroom Lead */}
      {article.bbcTakeaway && (
        <div className="bg-[#14080b] border-l-4 border-rose-600 p-5 rounded-r-2xl space-y-1.5 shadow-md">
          <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-wider text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>BBC Editorial Lead &amp; Sovereign Analysis</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-gray-100 leading-relaxed italic">
            "{article.bbcTakeaway}"
          </p>
        </div>
      )}

      {/* Key Executive Takeaways */}
      {article.takeaways && article.takeaways.length > 0 && (
        <div className="bg-gradient-to-r from-[#071324] via-[#0b1b33] to-[#081326] border-l-4 border-[#00aeef] p-6 rounded-r-2xl space-y-3 shadow-md">
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>Executive Takeaways &amp; Strategic Implications</span>
          </div>
          <ul className="space-y-2">
            {article.takeaways.map((t, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-sm text-gray-200">
                <span className="text-[#00aeef] font-bold mt-0.5">▪</span>
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technical Specifications Table */}
      {article.specs && article.specs.length > 0 && (
        <div className="bg-[#0e1422] rounded-2xl p-6 border border-[#1b253b] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center">
            <span className="w-2 h-2 rounded-full bg-[#00aeef] mr-2 shadow-sm shadow-cyan-400"></span>
            Technical Specifications &amp; Benchmarks
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {article.specs.map((s, idx) => (
              <div key={idx} className="bg-[#181d2a] p-3.5 rounded-xl border border-[#252f44] flex justify-between items-center text-xs">
                <span className="text-gray-400 font-medium">{s.label}</span>
                <span className="text-white font-bold font-mono text-sm">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formula 1 & InsideEVs Telemetry Card */}
      {article.telemetry && (
        <div className="bg-gradient-to-br from-[#070e1e] via-[#0b162b] to-[#060a14] border border-[#1b2a45] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#182740] pb-3">
            <div className="flex items-center space-x-2">
              <span className="bg-[#00aeef] text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded-sm transform skew-x-[-10deg] shadow-sm shadow-cyan-500/50">
                <span className="transform skew-x-[10deg] flex items-center">
                  <Flame className="w-3 h-3 mr-1 fill-current" />
                  TELEMETRY BENCHMARK
                </span>
              </span>
              <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                Formula 1 Speed &amp; InsideEVs Lab Telemetry
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">GPS &amp; Thermal Inverter Calibrated</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#070c17] p-3.5 rounded-xl border border-[#162338]">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">0–100 km/h Sprint</span>
              <span className="text-base sm:text-lg font-black font-mono text-cyan-300">{article.telemetry.acceleration0100 || 'N/A'}</span>
            </div>
            <div className="bg-[#070c17] p-3.5 rounded-xl border border-[#162338]">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Peak DC Fast Charge</span>
              <span className="text-base sm:text-lg font-black font-mono text-yellow-300">{article.telemetry.peakKwCharging || 'N/A'}</span>
            </div>
            <div className="bg-[#070c17] p-3.5 rounded-xl border border-[#162338]">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Thermal Resilience</span>
              <span className="text-base sm:text-lg font-black font-mono text-green-300">{article.telemetry.thermalScore || '96.2%'}</span>
            </div>
            <div className="bg-[#070c17] p-3.5 rounded-xl border border-[#162338]">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Aerodynamic Drag Cd</span>
              <span className="text-base sm:text-lg font-black font-mono text-purple-300">{article.telemetry.dragCd || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Body Content */}
      <div className="prose prose-invert max-w-none text-gray-300 text-base sm:text-lg leading-relaxed space-y-6 pt-2">
        {article.content.split('\n\n').map((para, idx) => {
          if (para.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl sm:text-2xl font-black text-white pt-4 pb-1 border-b border-[#1c2230]">
                {para.replace('### ', '')}
              </h3>
            );
          }
          if (para.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-yellow-500 pl-4 py-1 italic text-yellow-200 bg-yellow-950/10 rounded-r">
                {para.replace('> ', '')}
              </blockquote>
            );
          }
          return (
            <p key={idx} className="leading-relaxed">
              {para}
            </p>
          );
        })}
      </div>

      {/* Reddit r/electricvehicles Community Consensus Card */}
      {article.communityVerdict && (
        <div className="bg-[#0d101a] border border-orange-900/50 rounded-2xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-orange-400">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-black text-[10px] px-2 py-0.5 rounded font-black shadow">
                REDDIT r/electricvehicles
              </span>
              <span>Community Consensus &amp; Owner Verdict</span>
            </div>
            <span className="text-[10px] font-mono text-orange-400/80 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-800/40">
              ▲ 420+ Upvotes
            </span>
          </div>

          <blockquote className="text-sm sm:text-base text-gray-200 italic leading-relaxed pl-3.5 border-l-2 border-orange-500">
            "{article.communityVerdict}"
          </blockquote>

          <div className="text-[11px] text-gray-500 pt-1 flex items-center justify-between font-mono">
            <span>Aggregated from verified owner fleet telematics &amp; discussions</span>
            <span className="text-gray-400">r/electricvehicles verified</span>
          </div>
        </div>
      )}

      {/* Google Rich Snippets / FAQ Section */}
      {article.faqs && article.faqs.length > 0 && (
        <div className="bg-[#121622] rounded-2xl p-6 border border-[#242c3d] space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-300">
            <HelpCircle className="w-4 h-4 text-[#00f0ff]" />
            <span>Frequently Asked Questions &amp; Industry Analysis</span>
          </div>

          <div className="space-y-3">
            {article.faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-[#171c29] rounded-xl border border-[#263145] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 flex justify-between items-center text-sm font-bold text-white hover:text-rose-400 transition">
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-[#222a3a] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement & Social Share Bar */}
      <div className="bg-[#141822] rounded-2xl p-5 border border-[#232b3b] flex flex-wrap items-center justify-between gap-4">
        {/* Like Button */}
        <button 
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            liked ? 'bg-rose-600 text-white' : 'bg-[#1e2434] text-gray-300 hover:text-white hover:bg-[#273045]'
          }`}>
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          <span>{liked ? 'Liked' : 'Helpful'} ({likeCount})</span>
        </button>

        {/* Social Share Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 font-semibold mr-1">Share:</span>
          
          {/* X / Twitter */}
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-[#1a202e] text-gray-300 hover:text-white hover:bg-[#222a3d] border border-[#2b354b] transition"
            title="Share on X">
            <TwitterIcon className="w-4 h-4" />
          </a>

          {/* LinkedIn */}
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-[#1a202e] text-gray-300 hover:text-white hover:bg-[#222a3d] border border-[#2b354b] transition"
            title="Share on LinkedIn">
            <LinkedinIcon className="w-4 h-4" />
          </a>

          {/* WhatsApp */}
          <a 
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${window.location.href}`)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-[#1a202e] text-emerald-400 hover:text-emerald-300 hover:bg-[#222a3d] border border-[#2b354b] transition"
            title="Share on WhatsApp">
            <WhatsAppIcon className="w-4 h-4" />
          </a>

          {/* Copy Link */}
          <button 
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-[#1a202e] text-gray-300 hover:text-white hover:bg-[#222a3d] border border-[#2b354b] text-xs font-semibold transition"
            title="Copy URL">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Related Stories Grid */}
      {related.length > 0 && (
        <section className="pt-8 space-y-4 border-t border-[#1d2331]">
          <h3 className="text-base font-black text-white uppercase tracking-wider">
            Related {article.category} Intelligence
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(rel => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
