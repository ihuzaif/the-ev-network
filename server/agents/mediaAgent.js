import { db } from '../db.js';
import { stockImageService } from '../services/stockImageService.js';

export const mediaAgent = {
  /**
   * Generates a sleek, high-resolution SVG editorial graphic card (1200x630)
   * Inspired by ElectricDrives visual style with high contrast and electric neon accents.
   */
  generateEditorialCard({ title, category, region, readTime = "5 MIN READ", badgeColor = "#e63946" }) {
    // Truncate title for clean multi-line display in SVG
    const words = title.split(' ');
    let line1 = words.slice(0, 7).join(' ');
    let line2 = words.slice(7, 14).join(' ');
    let line3 = words.slice(14, 21).join(' ');
    if (words.length > 21) line3 += '...';

    const categoryText = (category || 'MOBILITY TECH').toUpperCase();
    const regionText = (region || 'GLOBAL').toUpperCase();

    const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0d11"/>
      <stop offset="50%" stop-color="#141720"/>
      <stop offset="100%" stop-color="#08090d"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#95220e"/>
      <stop offset="100%" stop-color="#e63946"/>
    </linearGradient>
    <linearGradient id="gridGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e63946" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#00f0ff" stop-opacity="0.05"/>
    </linearGradient>
    <pattern id="techGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#252a36" stroke-width="0.75" stroke-opacity="0.4"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#techGrid)"/>

  <!-- Electric Glow Orbs -->
  <circle cx="1050" cy="180" r="280" fill="url(#accentGrad)" opacity="0.12" filter="blur(60px)"/>
  <circle cx="150" cy="550" r="220" fill="#00f0ff" opacity="0.06" filter="blur(70px)"/>

  <!-- Accent Top Border -->
  <rect x="0" y="0" width="1200" height="6" fill="url(#accentGrad)"/>

  <!-- Electric Wire Circuit Accent -->
  <path d="M 60 120 L 250 120 L 290 80 L 1140 80" fill="none" stroke="#e63946" stroke-width="1.5" stroke-opacity="0.4"/>
  <circle cx="1140" cy="80" r="4" fill="#e63946"/>

  <!-- Category & Region Badges -->
  <g transform="translate(60, 160)">
    <rect x="0" y="0" width="160" height="34" rx="4" fill="#95220e"/>
    <text x="80" y="22" fill="#ffffff" font-family="'Inter', sans-serif" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="1.5">⚡ ${categoryText}</text>

    <rect x="175" y="0" width="140" height="34" rx="4" fill="#1b202c" stroke="#374151" stroke-width="1"/>
    <text x="245" y="22" fill="#9ca3af" font-family="'Inter', sans-serif" font-size="12" font-weight="600" text-anchor="middle" letter-spacing="1.2">📍 ${regionText}</text>
  </g>

  <!-- Main Headline -->
  <text x="60" y="270" fill="#f9fafb" font-family="'Inter', sans-serif" font-size="44" font-weight="800" letter-spacing="-0.5">${line1}</text>
  <text x="60" y="335" fill="#f9fafb" font-family="'Inter', sans-serif" font-size="44" font-weight="800" letter-spacing="-0.5">${line2}</text>
  ${line3 ? `<text x="60" y="400" fill="#9ca3af" font-family="'Inter', sans-serif" font-size="40" font-weight="700" letter-spacing="-0.5">${line3}</text>` : ''}

  <!-- Lower Details / Meta -->
  <g transform="translate(60, 520)">
    <!-- Brand Logo Text -->
    <text x="0" y="24" fill="#ffffff" font-family="'Inter', sans-serif" font-size="22" font-weight="900" letter-spacing="1">VOLT<tspan fill="#e63946">DRIVES</tspan></text>
    <text x="0" y="45" fill="#6b7280" font-family="'Inter', sans-serif" font-size="12" font-weight="600" letter-spacing="1.5">ELECTRICDRIVES NETWORK • INTELLIGENCE</text>

    <!-- Reading Time & Live Icon -->
    <rect x="940" y="6" width="140" height="36" rx="18" fill="#161b26" stroke="#e63946" stroke-width="1.5"/>
    <circle cx="962" cy="24" r="5" fill="#10b981"/>
    <text x="978" y="29" fill="#e5e7eb" font-family="'Inter', sans-serif" font-size="12" font-weight="700" letter-spacing="1">${readTime}</text>
  </g>
</svg>
    `.trim();

    return svg;
  },

  /**
   * Generates a dedicated Newsletter Header Graphic (1200x480)
   */
  generateNewsletterHeader({ issueNumber, title, date = new Date().toLocaleDateString() }) {
    const svg = `
<svg width="1200" height="480" viewBox="0 0 1200 480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nlBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#040711"/>
      <stop offset="100%" stop-color="#0c1628"/>
    </linearGradient>
    <linearGradient id="nlCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#00aeef"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="480" fill="url(#nlBg)"/>
  <rect x="0" y="0" width="1200" height="8" fill="url(#nlCyan)"/>

  <!-- Badge -->
  <rect x="80" y="70" width="240" height="32" rx="16" fill="#00aeef"/>
  <text x="200" y="91" fill="#040711" font-family="'Inter', sans-serif" font-size="12" font-weight="900" text-anchor="middle" letter-spacing="2">⚡ THE EV NETWORK DISPATCH</text>

  <!-- Issue & Date -->
  <text x="340" y="91" fill="#9ca3af" font-family="'Inter', sans-serif" font-size="14" font-weight="600">ISSUE #${issueNumber} • ${date}</text>

  <!-- Main Title -->
  <text x="80" y="180" fill="#ffffff" font-family="'Inter', sans-serif" font-size="44" font-weight="900" letter-spacing="-1">The EV Network • Mobility &amp; Energy Intelligence</text>
  <text x="80" y="240" fill="#cbd5e1" font-family="'Inter', sans-serif" font-size="24" font-weight="500">${title}</text>

  <!-- Graphic Line -->
  <line x1="80" y1="310" x2="1120" y2="310" stroke="#1e293b" stroke-width="1"/>

  <!-- Footer Tags -->
  <text x="80" y="370" fill="#00aeef" font-family="'Inter', sans-serif" font-size="15" font-weight="700">EVs • SOLID-STATE BATTERIES • CHARGING GRIDS • SEMICONDUCTORS • INDIA &amp; GLOBAL</text>
  <text x="80" y="410" fill="#64748b" font-family="'Inter', sans-serif" font-size="13">Curated by The EV Network Autonomous Newsroom | Delivered to 1,400+ Automotive &amp; Energy Executives</text>
</svg>
    `.trim();

    return svg;
  },

  /**
   * Generates AI image prompts tailored for Google Imagen 3 / Midjourney
   */
  generateImagePrompt(article) {
    return `Ultra-realistic cinematic automotive photography, wide angle shot of ${article.title}, modern EV technology aesthetic, dramatic studio rim lighting with electric cyan and cool blue tones, 8k resolution, photorealistic metallic finish, sharp focus, 35mm lens depth of field, clean futuristic dark background.`;
  },

  /**
   * Generates Canva direct template launch parameters
   */
  getCanvaIntegrationInfo() {
    return {
      templateUrl: db.getSettings().canvaTemplateUrl,
      recommendedDimensions: [
        { use: "Article Hero / Web Banner", width: 1200, height: 630, aspectRatio: "1.91:1" },
        { use: "Instagram Square Post / Carousel", width: 1080, height: 1080, aspectRatio: "1:1" },
        { use: "Newsletter Header Card", width: 1200, height: 480, aspectRatio: "2.5:1" },
        { use: "X / Twitter Summary Card", width: 1200, height: 675, aspectRatio: "16:9" }
      ],
      brandColors: {
        electricCyan: "#00AEEF",
        cobaltBlue: "#0284C7",
        backgroundMidnight: "#040711",
        surfaceCard: "#0E1422",
        textLight: "#F9FAFB"
      },
      instructions: "Open your Canva account, pick the 1200x630 dimension, paste your article headline and The EV Network logo, and export directly as WebP or PNG."
    };
  },

  async processArticleVisuals(article) {
    db.addAgentLog("Media Agent", "INFO", `Generating visual graphics, stock photography & prompt set for: "${article.title.substring(0, 45)}..."`);

    // Ensure high-resolution topic-matching stock photo is assigned
    if (!article.heroImage || article.heroImage.includes('1593941707882')) {
      const grabbed = stockImageService.grabImageForTopic(article.title, article.category, article.region);
      article.heroImage = grabbed.heroImage;
      article.imageAttribution = {
        author: grabbed.author,
        provider: grabbed.provider,
        authorUrl: grabbed.authorUrl,
        isPaid: grabbed.isPaid
      };
    }

    const imagePrompt = this.generateImagePrompt(article);
    const svgCard = this.generateEditorialCard({
      title: article.title,
      category: article.category,
      region: article.region,
      readTime: article.readTime
    });

    const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgCard)}`;
    
    article.dynamicBannerSvg = svgDataUri;
    article.imagePrompt = imagePrompt;

    db.updateAgentStatus('media', {
      lastRun: new Date().toISOString(),
      currentTask: `Assigned stock photo & visual card for "${article.title.substring(0, 45)}..."`
    });

    db.addAgentLog("Media Agent", "SUCCESS", `Branded visual & stock photography assigned for "${article.title.substring(0, 50)}..." [Source: ${article.imageAttribution?.provider || 'Unsplash'}]`);
    return article;
  }
};
