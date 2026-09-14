import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MissionControlTab from './MissionControlTab';
import ArticlesTab from './ArticlesTab';
import NewsletterStudioTab from './NewsletterStudioTab';
import SocialHubTab from './SocialHubTab';
import SeoSettingsTab from './SeoSettingsTab';
import OwnerLogin from './OwnerLogin';
import { 
  Activity, FileText, Mail, Share2, Settings, 
  LogOut, ExternalLink, ShieldCheck, Zap 
} from 'lucide-react';

export default function OwnerDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('mission'); // 'mission', 'articles', 'newsletter', 'social', 'seo'
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('voltdrives_owner_user');
    const token = localStorage.getItem('voltdrives_owner_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('voltdrives_owner_token');
    localStorage.removeItem('voltdrives_owner_user');
    setUser(null);
  };

  if (!user) {
    return <OwnerLogin onLoginSuccess={setUser} />;
  }

  const navTabs = [
    { id: 'mission', label: 'Agent Mission Control', icon: Activity, badge: '24/7' },
    { id: 'articles', label: 'Editorial CMS & Drafts', icon: FileText },
    { id: 'newsletter', label: 'Newsletter & Graphics', icon: Mail, badge: 'Canva' },
    { id: 'social', label: 'Social Distribution Hub', icon: Share2, badge: 'X/LI/IG' },
    { id: 'seo', label: 'SEO & Syndication', icon: Settings, badge: 'RSS/XML' }
  ];

  return (
    <div className="min-h-screen bg-[#090b10] text-gray-200">
      {/* Top Header Navigation */}
      <header className="bg-[#10131b] border-b border-[#1f2637] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="h-9 overflow-hidden rounded-lg border border-cyan-500/20 shrink-0 bg-[#07090e]">
                <img src="/the_ev_network_logo.png" alt="The EV Network" className="h-full w-auto object-contain" />
              </div>
            </Link>
            <span className="text-gray-500">•</span>
            <div className="flex items-center space-x-1.5 text-xs text-yellow-400 font-bold bg-yellow-950/30 px-2.5 py-1 rounded-full border border-yellow-700/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Publisher Command Center</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <Link 
              to="/" 
              target="_blank"
              className="hidden sm:flex items-center space-x-1 text-gray-300 hover:text-white transition">
              <span>View Live Website</span>
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </Link>

            <div className="flex items-center space-x-2 border-l border-[#242c3d] pl-4">
              <span className="text-gray-400 font-medium hidden md:inline">{user.email}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 p-1.5 rounded-lg bg-[#191e2b] hover:bg-[#252c3e] text-rose-400 hover:text-rose-300 transition"
                title="Sign Out">
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 overflow-x-auto border-t border-[#181e2b]">
          <nav className="flex space-x-2 py-2 text-xs font-bold uppercase tracking-wider">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#00aeef] text-black font-black shadow-md shadow-cyan-950/40' 
                      : 'text-gray-400 hover:text-white hover:bg-[#121c2e]'
                  }`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black font-bold' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-black/20 text-black font-bold' : 'bg-[#202738] text-gray-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {activeTab === 'mission' && <MissionControlTab />}
        {activeTab === 'articles' && <ArticlesTab />}
        {activeTab === 'newsletter' && <NewsletterStudioTab />}
        {activeTab === 'social' && <SocialHubTab />}
        {activeTab === 'seo' && <SeoSettingsTab />}
      </main>
    </div>
  );
}
