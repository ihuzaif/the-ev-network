import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import MarketTicker from './components/MarketTicker';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import NewsletterBanner from './components/NewsletterBanner';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import OwnerDashboard from './pages/OwnerPortal/OwnerDashboard';

function MainLayout() {
  const location = useLocation();
  const [activeRegion, setActiveRegion] = useState('All');
  const [searchOpen, setSearchOpen] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);

  const isOwnerRoute = location.pathname.startsWith('/owner');

  if (isOwnerRoute) {
    return <OwnerDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#040711] text-gray-100 selection:bg-[#00aeef] selection:text-black">
      {/* Live Market Ticker */}
      <MarketTicker />

      {/* Main Header & Navbar */}
      <Navbar 
        activeRegion={activeRegion}
        onRegionChange={setActiveRegion}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenNewsletter={() => setNewsletterModalOpen(true)}
      />

      {/* Main Public Content Body */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage activeRegion={activeRegion} onOpenNewsletter={() => setNewsletterModalOpen(true)} />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/category/:cat" element={<CategoryPage />} />
          <Route path="/region/:reg" element={<CategoryPage />} />
        </Routes>
      </main>

      {/* Global Interactive Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Rich Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}
