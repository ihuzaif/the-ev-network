import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { orchestrator } from './agents/agentOrchestrator.js';
import { mediaAgent } from './agents/mediaAgent.js';
import { socialAgent } from './agents/socialAgent.js';
import { newsletterAgent } from './agents/newsletterAgent.js';
import { stockImageService } from './services/stockImageService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------
// Public & Article Endpoints
// ---------------------------------------------

// Get list of articles with query filters
app.get('/api/articles', (req, res) => {
  const { category, region, status, search } = req.query;
  const articles = db.getArticles({ category, region, status, search });
  res.json({ success: true, count: articles.length, articles });
});

// Get article by slug
app.get('/api/articles/:slug', (req, res) => {
  const article = db.getArticleBySlug(req.params.slug);
  if (!article) {
    return res.status(404).json({ success: false, message: "Article not found" });
  }
  // Increment view counter
  article.views = (article.views || 0) + 1;
  db.save();
  res.json({ success: true, article });
});

// Like an article
app.post('/api/articles/:slug/like', (req, res) => {
  const article = db.getArticleBySlug(req.params.slug);
  if (article) {
    article.likes = (article.likes || 0) + 1;
    db.save();
    return res.json({ success: true, likes: article.likes });
  }
  res.status(404).json({ success: false, message: "Article not found" });
});

// Create article (Manual or Agent)
app.post('/api/articles', (req, res) => {
  const newArticle = db.addArticle(req.body);
  res.status(201).json({ success: true, article: newArticle });
});

// Update article
app.put('/api/articles/:id', (req, res) => {
  const updated = db.updateArticle(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Article not found" });
  }
  res.json({ success: true, article: updated });
});

// Delete article
app.delete('/api/articles/:id', (req, res) => {
  const deleted = db.deleteArticle(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Article not found" });
  }
  res.json({ success: true, article: deleted });
});

// ---------------------------------------------
// Live Market Data & Ticker
// ---------------------------------------------
app.get('/api/market-ticker', (req, res) => {
  res.json({ success: true, ticker: db.getMarketData() });
});

// ---------------------------------------------
// Newsletter Endpoints
// ---------------------------------------------
app.get('/api/newsletter', (req, res) => {
  res.json({ success: true, newsletters: db.getNewsletters() });
});

app.post('/api/newsletter/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: "Valid email address required." });
  }
  const result = db.addSubscriber(email);
  res.json({ success: true, ...result });
});

app.get('/api/newsletter/subscribers', (req, res) => {
  res.json({ success: true, subscribers: db.getSubscribers() });
});

app.post('/api/newsletter/compile', async (req, res) => {
  try {
    const { customSubject, customIntro, heroBanner } = req.body;
    const issue = await newsletterAgent.compileDigest({ customSubject, customIntro, heroBanner });
    res.json({ success: true, issue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------
// Autonomous Agent Management
// ---------------------------------------------
app.get('/api/agents/status', (req, res) => {
  res.json({
    success: true,
    agents: db.data.agents,
    isSchedulerRunning: orchestrator.timer !== null
  });
});

app.get('/api/agents/logs', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json({ success: true, logs: db.getAgentLogs(limit) });
});

app.post('/api/agents/run', async (req, res) => {
  const { prompt, category, region } = req.body;
  const result = await orchestrator.runCycle(prompt, category, region);
  res.json(result);
});

// ---------------------------------------------
// Stock Photography & Image Sourcing Endpoints
// Supports Unsplash, Pexels, Adobe Stock, Shutterstock
// ---------------------------------------------
app.get('/api/images/search', async (req, res) => {
  try {
    const { query, provider, page, perPage } = req.query;
    const result = await stockImageService.searchImages({
      query: query || '',
      provider: provider || 'all',
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 12
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/images/grab-topic', (req, res) => {
  try {
    const { topic, category, region } = req.query;
    const result = stockImageService.grabImageForTopic(topic || '', category || 'Cars', region || 'Global');
    res.json({ success: true, image: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/images/providers', (req, res) => {
  res.json({ success: true, ...stockImageService.getProviderConfig() });
});

app.post('/api/images/settings', (req, res) => {
  const { stockImageProvider, stockApiKeys } = req.body;
  const currentSettings = db.getSettings();
  const updated = db.updateSettings({
    stockImageProvider: stockImageProvider || currentSettings.stockImageProvider || 'unsplash',
    stockApiKeys: {
      ...currentSettings.stockApiKeys,
      ...stockApiKeys
    }
  });
  res.json({ success: true, settings: updated });
});

// ---------------------------------------------
// Social Media Automation
// ---------------------------------------------
app.post('/api/social/dispatch', async (req, res) => {
  const { postId, platform, copy } = req.body;
  const result = await socialAgent.dispatchPost(postId, platform, copy);
  res.json({ success: true, result });
});

// ---------------------------------------------
// Media & Graphics Endpoints
// ---------------------------------------------
app.get('/api/media/generate-card', (req, res) => {
  const { title, category, region, readTime } = req.query;
  const svg = mediaAgent.generateEditorialCard({
    title: title || "EV Technology Breakthrough",
    category: category || "Batteries",
    region: region || "Global",
    readTime: readTime || "5 MIN READ"
  });
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

app.get('/api/media/canva-info', (req, res) => {
  res.json({ success: true, ...mediaAgent.getCanvaIntegrationInfo() });
});

// ---------------------------------------------
// Owner Authentication & Settings
// ---------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const settings = db.getSettings();

  if (email === settings.ownerEmail && password === settings.ownerPassword) {
    return res.json({
      success: true,
      token: "owner-jwt-" + Date.now(),
      user: {
        email: settings.ownerEmail,
        role: "owner",
        name: "Publisher & Newsroom Director"
      }
    });
  }
  res.status(401).json({ success: false, message: "Invalid email or password." });
});

app.get('/api/settings', (req, res) => {
  const settings = { ...db.getSettings() };
  delete settings.ownerPassword; // Don't expose password in plain GET
  res.json({ success: true, settings });
});

app.put('/api/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

// ---------------------------------------------
// SEO Feeds: RSS 2.0 & XML Sitemap
// ---------------------------------------------
app.get('/feed.xml', (req, res) => {
  const articles = db.getArticles({ status: "published" }).slice(0, 20);
  const siteUrl = "https://theevnetwork.com";

  let itemsXml = articles.map(a => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${siteUrl}/article/${a.slug}</link>
      <guid isPermaLink="true">${siteUrl}/article/${a.slug}</guid>
      <description><![CDATA[${a.summary}]]></description>
      <category>${a.category}</category>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/"><![CDATA[${a.author}]]></dc:creator>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The EV Network - Electric Mobility, Batteries &amp; Semiconductor Intelligence</title>
    <link>${siteUrl}</link>
    <description>24/7 breaking news and technical deep-dives on EV vehicles, charging infrastructure, battery chemistry, and automotive semiconductors covering Global and Indian markets.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(rss);
});

app.get('/sitemap.xml', (req, res) => {
  const articles = db.getArticles({ status: "published" });
  const siteUrl = "https://theevnetwork.com";

  let urlsXml = articles.map(a => `
    <url>
      <loc>${siteUrl}/article/${a.slug}</loc>
      <lastmod>${new Date(a.publishedAt).toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  ${urlsXml}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(sitemap);
});

// ---------------------------------------------
// Serve React Frontend (client/dist)
// ---------------------------------------------
const distPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Fallback to index.html for React SPA client routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start background agent runner
orchestrator.startBackgroundWorker(60);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚡ THE EV NETWORK NEWSROOM SERVER RUNNING ON PORT ${PORT}`);
  console.log(`🌐 Web App:     http://localhost:${PORT}`);
  console.log(`🛡️ Owner Suite: http://localhost:${PORT}/owner`);
  console.log(`📡 RSS Feed:    http://localhost:${PORT}/feed.xml`);
  console.log(`🗺️ XML Sitemap: http://localhost:${PORT}/sitemap.xml`);
  console.log(`⚙️ 24/7 Autonomous Agents: ACTIVE (Scout, Editor, Media, Social, Dispatch)`);
  console.log(`====================================================`);
});
