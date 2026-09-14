# ⚡ VoltDrives: Autonomous Electric Mobility News Intelligence Platform

An interactive, high-performance news platform inspired by [ElectricDrives.tv](https://electricdrives.tv/), engineered to report 24/7 on electric vehicles (2W, 3W, 4W, commercial trucks & fleets), megawatt charging infrastructure, solid-state & LFP batteries, and automotive semiconductors covering both **India 🇮🇳** and **Global 🌐** markets.

Behind the scenes, a fleet of **autonomous multi-agent AI workers** continuously scouts breaking news signals, drafts editorial-grade deep-dives with technical specifications, renders dynamic visual header cards, formats multi-platform social campaigns (X, LinkedIn, Instagram), and compiles weekly newsletter dispatches.

---

## 🌟 Key Architecture & Features

### 1. 📰 Editorial Front-End (ElectricDrives Lookalike)
- **Top Barometer & Live Ticker**: Real-time stock prices (Tesla, BYD, Tata Motors, Mahindra, Rivian, Nvidia) and battery raw material commodities (Lithium Carbonate, Nickel, Cobalt, Cell Price/kWh).
- **Hero Featured Grid**: Signature ElectricDrives layout with 1 prominent lead feature story and 3 vertically stacked trending stories.
- **Regional & Category Hubs**: Instant filter pills across **Cars**, **Commercial Fleets**, **Charging & Infra**, **Battery Tech**, **Semiconductors**, and **India EV Spotlight**.
- **Deep-Dive Article Reader**:
  - Executive Key Takeaways bullet box.
  - Interactive technical specifications table.
  - **In-Browser Audio Player (TTS)**: Readers can listen to articles aloud via speech synthesis.
  - Google Rich Snippets FAQ accordion.
  - Multi-channel social sharing (X, LinkedIn, WhatsApp, Copy Link).
- **Interactive EV Cost & Savings Calculator**:
  - Interactive sliders for daily commute distance, fuel price, and electricity tariffs in both Indian Rupees (₹) and US Dollars ($).
  - Calculates annual financial savings and CO₂ emission reductions in real time.
- **Live Community Sentiment Poll**:
  - Readers vote on battery chemistry transitions with instant animated percentage bars and celebration confetti.
- **Newsletter Subscription Hub**:
  - Instant modal previewing the latest issue of *The Volt Dispatch* with generated header graphics.

---

### 2. 🤖 24/7 Autonomous Multi-Agent Fleet
VoltDrives runs an integrated pipeline of 5 specialized agents:
1. **Scout Agent**: Scans OEM press releases, patent filings, and industry registers across Global and Indian EV manufacturers.
2. **Editor Agent**: Writes publication-grade articles complete with journalistic hooks, technical analysis, specifications, and Google Rich Snippet FAQs.
3. **Media Agent**:
   - Generates dynamic, high-contrast branded SVG banner cards (1200x630) on the fly.
   - Generates issue headers for *The Volt Dispatch* (1200x480).
   - Generates photorealistic AI image generation prompts for Google Imagen 3 / Midjourney.
4. **Social Agent**:
   - Formats tailored copy for **X (Twitter)** (hook + bullet points + link + hashtags).
   - Formats thought-leadership articles for **LinkedIn**.
   - Formats 5-slide **Instagram Carousel** copy with slide-by-slide breakdowns.
5. **Newsletter Agent**:
   - Compiles weekly editions of *The Volt Dispatch* featuring top stories, battery index movements, and publisher notes.

---

### 3. 🛡️ Owner & Editorial Admin Portal (`/owner`)
Access the protected dashboard at `http://localhost:5000/owner`:
- **Default Login Credentials**:
  - **Email**: `admin@voltdrives.com`
  - **Password**: `admin123`
- **Agent Mission Control**:
  - Real-time status cards of all 5 agents (Status, Last Run, Completed Tasks).
  - Live auto-refreshing streaming terminal log.
  - **"Trigger Agent Run" Modal**: Enter any custom topic (e.g. *"Tata Motors launches 800V SiC platform"*) or let agents auto-scout on demand.
  - **Auto-Publish Toggle**: Switch between direct publishing or holding new stories in drafts for manual review.
- **Editorial CMS**:
  - Full article table with view counts, likes, category tags, and region flags.
  - 1-click Publish Drafts, Unpublish, Feature on homepage, or Delete.
  - Manual article creator.
- **Newsletter Studio & Canva Integration Hub**:
  - Visual Banner Customizer: Customize title, issue number, and badge with instant SVG preview and 1-click SVG download or Data URI copy.
  - **Canva Account Integration**: Direct links to Canva template editors with recommended dimensions (1200x480 newsletter, 1200x630 OG card, 1080x1080 Instagram square) and brand hex codes (`#95220E`, `#0B0D11`, `#F9FAFB`).
  - Subscriber table with CSV export.
- **Social Media Command Hub**:
  - Interactive multi-tab visual previews of how articles look on **X**, **LinkedIn**, and **Instagram Carousel**.
  - Interactive slide stepper for Instagram carousel cards.
  - 1-click Copy formatted post or trigger automated webhooks (Buffer, Zapier, Make.com).
- **SEO & Syndication Suite**:
  - Live inspection of `/feed.xml` (RSS 2.0) and `/sitemap.xml` (Google Sitemap).
  - Structured JSON-LD schema verification.

---

### 4. 🚀 Running the Platform

#### Step 1: Start the Newsroom Server
```bash
cd C:\Users\Ahmad\.gemini\antigravity\scratch\volt-drives
npm start
```
The server will boot on port `5000`:
- **Web Portal**: [http://localhost:5000](http://localhost:5000)
- **Owner Admin Portal**: [http://localhost:5000/owner](http://localhost:5000/owner)
- **RSS News Feed**: [http://localhost:5000/feed.xml](http://localhost:5000/feed.xml)
- **XML Sitemap**: [http://localhost:5000/sitemap.xml](http://localhost:5000/sitemap.xml)

#### Step 2: (Optional) Client Hot-Reload Dev Server
For active frontend development:
```bash
cd client
npm run dev
```

#### Step 3: Run End-to-End Verification Tests
```bash
node test-e2e.js
```
