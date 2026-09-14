import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Zap, Eye, X, Sparkles, ExternalLink } from 'lucide-react';

export default function NewsletterBanner({ isOpenModal, onCloseModal }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [latestNewsletter, setLatestNewsletter] = useState(null);

  useEffect(() => {
    fetch('/api/newsletter')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.newsletters && data.newsletters.length > 0) {
          setLatestNewsletter(data.newsletters[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070e1c] via-[#0b162c] to-[#050913] border border-cyan-500/30 p-8 sm:p-12 shadow-2xl">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00aeef]/15 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#00f0ff]/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy (Span 7) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-cyan-500/20 border border-cyan-500/50 px-3 py-1 rounded-full text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-current text-cyan-400" />
                <span>The EV Network Dispatch • Global &amp; India</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Join 1,400+ Mobility Executives Getting Our Weekly Briefing.
              </h2>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
                Curated by our autonomous newsroom agents. Delivered every Tuesday: raw battery metal pricing, 800V silicon carbide breakthroughs, fast-charging grid milestones, and deep policy analyses.
              </p>

              <div className="flex items-center space-x-4 pt-1">
                <button 
                  onClick={() => setShowPreviewModal(true)}
                  className="inline-flex items-center text-xs font-bold text-gray-300 hover:text-white underline decoration-[#00aeef] underline-offset-4 transition">
                  <Eye className="w-3.5 h-3.5 mr-1 text-[#00aeef]" />
                  Preview Latest Issue #{latestNewsletter ? latestNewsletter.issueNumber : 42}
                </button>
                <span className="text-gray-600">•</span>
                <span className="text-xs text-emerald-400 font-medium flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  No Spam, 1-Click Unsubscribe
                </span>
              </div>
            </div>

            {/* Right Form (Span 5) */}
            <div className="lg:col-span-5 bg-[#0d1424]/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#1d2b45] shadow-xl">
              {subscribed ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">You're Subscribed!</h4>
                  <p className="text-xs text-gray-300">
                    Check your inbox shortly for your first issue of <strong>The EV Network Dispatch</strong>.
                  </p>
                  <button 
                    onClick={() => setSubscribed(false)} 
                    className="text-xs text-[#00aeef] hover:underline font-semibold mt-2 inline-block">
                    Add another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <h4 className="text-base font-bold text-white">
                    Subscribe Free to The EV Network Dispatch
                  </h4>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-medium block">
                      Corporate or Personal Email
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="e.g. elon@tesla.com or anand@mahindra.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#070b14] border border-[#1b253b] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00aeef] transition"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#0284c7] to-[#00aeef] hover:brightness-110 text-black font-bold py-3 px-6 rounded-xl text-sm transition shadow-lg shadow-cyan-950/50 flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{loading ? 'Subscribing...' : 'Get Weekly Intelligence'}</span>
                  </button>

                  <p className="text-[11px] text-gray-500 text-center">
                    By subscribing, you agree to receive editorial newsletters from The EV Network.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal Preview of Latest Newsletter Issue */}
      {showPreviewModal && latestNewsletter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121622] border border-[#2c3548] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg bg-[#1a202d]">
              <X className="w-5 h-5" />
            </button>

            {/* Newsletter Graphic Header */}
            <div className="rounded-xl overflow-hidden border border-[#293245] shadow-lg">
              <img 
                src={latestNewsletter.heroBanner} 
                alt="Volt Dispatch Header Graphic"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Newsletter Content Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-xs text-gray-400 font-mono">
                <span className="text-[#00aeef] font-bold">ISSUE #{latestNewsletter.issueNumber}</span>
                <span>•</span>
                <span>{new Date(latestNewsletter.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>Delivered to {latestNewsletter.sentTo} readers</span>
              </div>

              <h3 className="text-2xl font-black text-white">
                {latestNewsletter.title}
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed bg-[#121a2c] p-4 rounded-xl border border-[#1e2e4b]">
                {latestNewsletter.intro}
              </p>

              {/* Stories in this issue */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Featured Stories in this Dispatch:
                </h4>
                <ul className="space-y-2">
                  {latestNewsletter.stories && latestNewsletter.stories.map((s, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-200">
                      <span className="text-[#00aeef] font-bold">⚡</span>
                      <span>{typeof s === 'string' ? s : s.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Market highlight */}
              {latestNewsletter.marketHighlight && (
                <div className="bg-[#101726] p-4 rounded-xl border border-[#1e2e4b] text-xs text-gray-300">
                  <strong className="text-cyan-300 block mb-1">📊 Market Barometer Highlight:</strong>
                  {latestNewsletter.marketHighlight}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#1b253b] flex justify-end">
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black font-bold text-xs hover:brightness-110 transition shadow-md">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
