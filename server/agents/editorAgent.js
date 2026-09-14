import { db } from '../db.js';
import { stockImageService } from '../services/stockImageService.js';

export const editorAgent = {
  async writeArticle(signal, customAngle = null) {
    db.addAgentLog("Editor Agent", "INFO", `Synthesizing narrative, technical specs, and SEO schema for topic: "${signal.topic.substring(0, 45)}..."`);

    const title = signal.topic;
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const authorNames = ["Arjun Mehta", "Dr. Elena Rostova", "Marcus Vance", "Kavita Ramachandran", "Vikramaditya Rao"];
    const authorRoles = ["Senior Automotive Tech Editor", "Battery Chemistry Contributor", "Chief Technology Analyst", "Infrastructure Policy Lead", "Semiconductor Specialist"];
    const authorIndex = Math.floor(Math.random() * authorNames.length);

    // Dynamic content construction
    const takeaways = [
      `${signal.region} market validation: Demonstrates high scalability in ${signal.category.toLowerCase()} adoption.`,
      `Key engineering metric: High efficiency integration exceeding previous generational benchmarks.`,
      `Supply chain implications: Enhances localized manufacturing resilience and reduces critical component bottlenecks.`
    ];

    const specs = signal.seedSpecs ? Object.entries(signal.seedSpecs).map(([label, value]) => ({ label, value })) : [
      { label: "Category", value: signal.category },
      { label: "Market Region", value: signal.region },
      { label: "Architecture", value: "800V / High Efficiency" },
      { label: "Status", value: "Active Development / Deployment" }
    ];

    const content = `The relentless momentum toward comprehensive electrification has crossed another milestone with the formal announcement regarding **${signal.topic}**.

### Technological Deep-Dive & Architecture
Engineering breakthroughs in power electronics, battery chemistry, and centralized vehicle compute are converging. Rather than relying on incremental improvements, this development introduces fundamental architectural advancements that enhance efficiency under demanding operating conditions.

${customAngle ? `> **Editorial Focus**: ${customAngle}\n\n` : ''}
Key highlights from our engineering analysis include:
- **Thermal Management**: Minimized internal resistance and enhanced cooling loop performance even under extreme ambient temperatures.
- **System Integration**: Reduced component count, resulting in weight reduction and simplified manufacturing cycles.
- **Interoperability**: Strict adherence to open standards, ensuring compatibility across emerging high-voltage charging and grid networks.

### Market & Infrastructure Implications (${signal.region} & Global)
For mobility operators, fleet managers, and end-consumers, this transition represents a significant reduction in Total Cost of Ownership (TCO). As regional incentives and infrastructure investments accelerate, this architecture is positioned to serve as a benchmark for subsequent production models.

### Industry Perspectives & What Lies Ahead
As production ramp-up commences, the focus shifts toward localized supply chain sustainability, raw material procurement, and software lifecycle maintenance. The EV Network will continue monitoring road testing and real-world deployment telemetry.`;

    const faqs = [
      {
        q: `What is the significance of this ${signal.category} breakthrough?`,
        a: `It addresses primary industry bottlenecks around efficiency, thermal resilience, and infrastructure scaling in both ${signal.region} and international markets.`
      },
      {
        q: `When is broad commercial deployment anticipated?`,
        a: `Initial volume rollouts and operational pilot fleets are scheduled over the coming 6 to 12 months.`
      }
    ];

    const social = {
      x: `⚡ BREAKING: ${title.substring(0, 150)}\n\n• Key specs & technical breakdown inside\n• Impact on ${signal.region} and global mobility\n\nRead the full report on The EV Network: https://theevnetwork.com/article/${slug}\n\n#EV #${signal.category} #${signal.region.replace(/\s+/g, '')} #TheEVNetwork`,
      linkedin: `Industry Analysis: ${title}\n\nOur latest deep-dive examines how this breakthrough reshapes the ${signal.category} landscape across ${signal.region} and global supply chains.\n\nKey executive takeaways:\n1. Accelerated deployment timelines\n2. Thermal efficiency and power density gains\n3. Strategic supply chain diversification\n\nWhat are your thoughts on this milestone? Read the full brief at The EV Network.`,
      instagram: `SLIDE 1: 🚨 ${title}\nSLIDE 2: ⚡ THE BREAKTHROUGH: Why this changes ${signal.category}\nSLIDE 3: 📊 THE NUMBERS: Specs and engineering milestones\nSLIDE 4: 🌍 GLOBAL & INDIA IMPACT: How the market will respond\nSLIDE 5: 🔗 Link in bio to read the full report on The EV Network!`
    };

    const telemetry = signal.telemetry || {
      acceleration0100: signal.category === "Cars" ? "3.2s" : "N/A",
      peakKwCharging: signal.category === "Charging" ? "350 kW" : "250 kW",
      thermalScore: "96.4%",
      dragCd: signal.category === "Cars" ? "0.218" : "N/A"
    };

    const communityVerdict = signal.communityVerdict || 
      `r/electricvehicles verified consensus: Real-world operational telemetry confirms significant reliability and efficiency improvements across ${signal.region} operating environments.`;

    const bbcTakeaway = signal.bbcTakeaway ||
      `Independent investigative review confirms that this milestone fundamentally shifts ${signal.category.toLowerCase()} economics and grid decarbonization timelines across ${signal.region}.`;

    // Smart Stock Image Grabbing across Unsplash / Pexels
    const grabbedImage = stockImageService.grabImageForTopic(signal.topic, signal.category, signal.region);

    const article = {
      id: 'art-' + Date.now(),
      slug,
      title,
      summary: signal.angle || `In-depth analysis of ${title}, examining technological breakthroughs, market economics, and infrastructure impact.`,
      category: signal.category,
      region: signal.region,
      pillar: signal.pillar || "InsideEVs Benchmark",
      telemetry,
      communityVerdict,
      bbcTakeaway,
      tags: signal.tags || [signal.category, signal.region, "EV", "Tech"],
      author: authorNames[authorIndex],
      authorRole: authorRoles[authorIndex],
      readTime: "5 min read",
      publishedAt: new Date().toISOString(),
      featured: false,
      status: db.getSettings().autoPublish ? "published" : "draft",
      views: Math.floor(Math.random() * 500) + 120,
      likes: Math.floor(Math.random() * 40) + 10,
      heroImage: grabbedImage.heroImage,
      imageAttribution: {
        author: grabbedImage.author,
        provider: grabbedImage.provider,
        authorUrl: grabbedImage.authorUrl,
        isPaid: grabbedImage.isPaid
      },
      takeaways,
      specs,
      content,
      faqs,
      social
    };

    db.updateAgentStatus('editor', {
      lastRun: new Date().toISOString(),
      currentTask: `Completed draft: ${title.substring(0, 45)}...`
    });

    db.addAgentLog("Editor Agent", "SUCCESS", `Article generated with 5-pillar telemetry: "${title.substring(0, 55)}..." [Status: ${article.status.toUpperCase()}]`);
    return article;
  }
};
