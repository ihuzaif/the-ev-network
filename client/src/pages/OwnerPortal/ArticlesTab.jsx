import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, CheckCircle, Clock, Trash2, Star, 
  ExternalLink, Plus, Sparkles, X, Edit3, Eye, Image as ImageIcon 
} from 'lucide-react';
import StockImagePickerModal from '../../components/StockImagePickerModal';

export default function ArticlesTab() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New article form
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Batteries');
  const [region, setRegion] = useState('India');
  const [author, setAuthor] = useState('The EV Network Editorial');
  const [creating, setCreating] = useState(false);

  // Stock Photo Sourcing & Grabbing State
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80');
  const [imageAttribution, setImageAttribution] = useState({ provider: 'Unsplash (Free)', author: 'Martin Katler', isPaid: false });
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [activeArticleForPhotoChange, setActiveArticleForPhotoChange] = useState(null);
  const [grabbingImage, setGrabbingImage] = useState(false);

  const handleAutoGrabImage = async (customTitle = title) => {
    setGrabbingImage(true);
    try {
      const res = await fetch(`/api/images/grab-topic?topic=${encodeURIComponent(customTitle || 'electric vehicle')}&category=${encodeURIComponent(category)}&region=${encodeURIComponent(region)}`);
      const data = await res.json();
      if (data.success && data.image) {
        setHeroImage(data.image.heroImage);
        setImageAttribution({
          provider: data.image.provider,
          author: data.image.author,
          authorUrl: data.image.authorUrl,
          isPaid: data.image.isPaid
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGrabbingImage(false);
    }
  };

  const handleSelectImage = async (img) => {
    if (activeArticleForPhotoChange) {
      await fetch(`/api/articles/${activeArticleForPhotoChange.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroImage: img.url,
          imageAttribution: {
            author: img.author,
            provider: img.provider,
            authorUrl: img.authorUrl,
            isPaid: img.isPaid
          }
        })
      });
      fetchArticles();
      setActiveArticleForPhotoChange(null);
    } else {
      setHeroImage(img.url);
      setImageAttribution({
        provider: img.provider,
        author: img.author,
        authorUrl: img.authorUrl,
        isPaid: img.isPaid
      });
    }
  };

  const fetchArticles = () => {
    setLoading(true);
    fetch('/api/articles')
      .then(r => r.json())
      .then(d => {
        if (d.success) setArticles(d.articles || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchArticles();
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !currentFeatured })
    });
    fetchArticles();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    fetchArticles();
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newArt = {
        title,
        slug,
        summary,
        category,
        region,
        content: content || `${title}\n\n### Overview\n${summary}`,
        author,
        authorRole: "Staff Writer",
        readTime: "4 min read",
        publishedAt: new Date().toISOString(),
        featured: false,
        status: "published",
        heroImage: heroImage || "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80",
        imageAttribution: imageAttribution || { provider: 'Unsplash (Free)', author: 'Stock Photography' },
        takeaways: [summary],
        specs: [{ label: "Category", value: category }, { label: "Region", value: region }]
      };

      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArt)
      });

      fetchArticles();
      setCreateModalOpen(false);
      setTitle('');
      setSummary('');
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const filtered = articles.filter(a => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white">
            Editorial CMS &amp; Draft Verification
          </h3>
          <p className="text-xs text-gray-400">
            Review agent-drafted stories, approve publications, and manage homepage feature badges.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Status Filter Tabs */}
          <div className="flex bg-[#161a25] p-1 rounded-xl border border-[#263045] text-xs font-bold">
            {['ALL', 'PUBLISHED', 'DRAFT'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === s ? 'bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}>
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-[#0284c7] to-[#00aeef] hover:brightness-110 text-black px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-cyan-950/40">
            <Plus className="w-4 h-4 font-bold" />
            <span>Create Story</span>
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#121622] rounded-2xl border border-[#21293a] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#161a25] text-gray-400 uppercase tracking-wider font-mono text-[11px] border-b border-[#21293a]">
              <tr>
                <th className="py-3 px-4">Headline</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Engagement</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a202d]">
              {filtered.map(art => (
                <tr key={art.id} className="hover:bg-[#161c28] transition">
                  <td className="py-3.5 px-4 font-bold text-white max-w-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-[#070b14] border border-[#1e2a3e] shrink-0 relative">
                        <img src={art.heroImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          {art.featured && (
                            <span className="text-amber-400" title="Featured Lead Story">
                              ★
                            </span>
                          )}
                          <Link to={`/article/${art.slug}`} className="hover:text-cyan-300 line-clamp-1">
                            {art.title}
                          </Link>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-mono mt-0.5">
                          <span>By {art.author}</span>
                          <span>•</span>
                          <span className="text-cyan-400/80">{art.imageAttribution?.provider || 'Stock Photo'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="bg-[#1e2535] text-gray-300 px-2 py-0.5 rounded font-mono text-[10px] border border-[#2c364e]">
                      {art.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-gray-300 font-semibold">
                    {art.region}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      art.status === 'published' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' 
                        : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                    }`}>
                      {art.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-gray-400 text-[11px]">
                    <span className="text-white">{art.views || 0}</span> views • <span className="text-rose-400">{art.likes || 0}</span> likes
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    {art.status === 'draft' ? (
                      <button 
                        onClick={() => handleUpdateStatus(art.id, 'published')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded text-[10px] font-bold transition">
                        Publish Draft
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUpdateStatus(art.id, 'draft')}
                        className="bg-[#242c3d] hover:bg-[#2f394f] text-gray-300 px-2 py-1 rounded text-[10px] font-medium transition">
                        Unpublish
                      </button>
                    )}

                    <button 
                      onClick={() => handleToggleFeatured(art.id, art.featured)}
                      className={`p-1 rounded transition ${art.featured ? 'text-amber-400 bg-amber-950/30' : 'text-gray-500 hover:text-white'}`}
                      title="Toggle Featured Lead Story">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button 
                      onClick={() => {
                        setActiveArticleForPhotoChange(art);
                        setStockModalOpen(true);
                      }}
                      className="p-1 rounded text-cyan-400 hover:text-cyan-300 hover:bg-[#1b263b] transition"
                      title="Change Stock Image (Unsplash / Pexels / Adobe / Shutterstock)">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>

                    <Link 
                      to={`/article/${art.slug}`}
                      className="inline-block p-1 text-gray-400 hover:text-white"
                      title="View Article">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button 
                      onClick={() => handleDelete(art.id)}
                      className="p-1 text-gray-500 hover:text-rose-400 transition"
                      title="Delete Article">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Create Story Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121622] border border-[#2b3548] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg bg-[#1a202d]">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white">
              Create New Mobility Article
            </h3>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 block">Article Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Ather Energy Deploys 500kW Fast Charging Network Across South India"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00aeef]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 block">Executive Summary Hook</label>
                <textarea 
                  rows="2"
                  required
                  placeholder="Concise 1-2 sentence lead summary..."
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00aeef]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 block">Category</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#00aeef]">
                    <option value="Cars">Cars &amp; SUVs</option>
                    <option value="Commercial">Commercial &amp; Fleets</option>
                    <option value="Charging">Charging &amp; Infra</option>
                    <option value="Batteries">Battery Tech</option>
                    <option value="Semiconductors">Semiconductors</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 block">Region</label>
                  <select 
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#00aeef]">
                    <option value="India">India 🇮🇳</option>
                    <option value="Global">Global 🌐</option>
                    <option value="USA">USA</option>
                    <option value="Europe">Europe</option>
                  </select>
                </div>
              </div>

              {/* Stock Photo Sourcing & Hero Image Selector */}
              <div className="space-y-2 p-3.5 rounded-xl bg-[#090d16] border border-[#1b263b]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-300 flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Featured Article Image &amp; Stock Photography</span>
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                    {imageAttribution?.provider || 'Unsplash / Pexels'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="w-full sm:w-36 h-24 rounded-lg overflow-hidden bg-[#050811] border border-[#1d2b42] relative shrink-0">
                    <img src={heroImage} alt="Article Hero Preview" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="text-[11px] text-gray-400 truncate">
                      <span className="text-gray-500">Photographer:</span> {imageAttribution?.author || 'Stock Photography'}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAutoGrabImage(title)}
                        disabled={grabbingImage}
                        className="flex items-center space-x-1.5 bg-[#121c2e] hover:bg-[#18263d] text-cyan-300 text-xs px-3 py-1.5 rounded-lg border border-cyan-800/60 transition font-bold disabled:opacity-50">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{grabbingImage ? "Matching..." : "⚡ Auto-Grab For Topic"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveArticleForPhotoChange(null);
                          setStockModalOpen(true);
                        }}
                        className="flex items-center space-x-1.5 bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black text-xs px-3 py-1.5 rounded-lg font-bold hover:brightness-110 transition shadow">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Browse 4 Stock Providers</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 block">Body Content (Markdown)</label>
                <textarea 
                  rows="5"
                  placeholder="Detailed breakdown with ### headings..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full bg-[#0d1017] border border-[#273248] rounded-xl p-3 text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#00aeef]"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-[#1a202d]">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#0284c7] to-[#00aeef] hover:brightness-110 shadow-lg shadow-cyan-950/40">
                  {creating ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Image Picker Modal */}
      <StockImagePickerModal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        onSelectImage={handleSelectImage}
        initialQuery={activeArticleForPhotoChange ? activeArticleForPhotoChange.title : (title || category)}
      />
    </div>
  );
}
