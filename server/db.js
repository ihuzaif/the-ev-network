import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data
const initialData = {
  settings: {
    siteName: "The EV Network",
    tagline: "The Global & India Electric Mobility Intelligence Network",
    ownerEmail: "admin@theevnetwork.com",
    ownerPassword: "admin123", // For production, use bcrypt hash
    instagramHandle: "@the.ev.network",
    autoPublish: false, // By default, requires owner review before publishing
    agentFrequencyMinutes: 60,
    canvaTemplateUrl: "https://www.canva.com/design/templates?query=tech+news+banner",
    webhooks: {
      zapierBuffer: "",
      xEndpoint: "",
      linkedinEndpoint: "",
      instagramEndpoint: ""
    }
  },
  marketTicker: [
    { symbol: "TSLA", name: "Tesla Inc", price: 248.50, change: "+3.2%", isPositive: true },
    { symbol: "BYD", name: "BYD Auto", price: 34.15, change: "+1.8%", isPositive: true },
    { symbol: "TATAMTR", name: "Tata Motors EV", price: 982.40, change: "+4.1%", isPositive: true },
    { symbol: "M&M", name: "Mahindra Electric", price: 2840.00, change: "+2.4%", isPositive: true },
    { symbol: "RIVN", name: "Rivian Automotive", price: 14.80, change: "-0.9%", isPositive: false },
    { symbol: "NVDA", name: "Nvidia Drive/Thor", price: 128.90, change: "+2.6%", isPositive: true },
    { symbol: "LITHIUM", name: "Li Carbonate/Tonne", price: 10450, change: "+1.2%", isPositive: true, unit: "$" },
    { symbol: "NICKEL", name: "Nickel Battery Grade", price: 16200, change: "-0.4%", isPositive: false, unit: "$" },
    { symbol: "LFP CELL", name: "Cell Price/kWh", price: 62.50, change: "-3.8%", isPositive: false, unit: "$" }
  ],
  agents: {
    scout: { name: "Scout Agent", role: "Trend Discovery & Signal Extraction", status: "Active", lastRun: new Date().toISOString(), tasksCompleted: 48 },
    editor: { name: "Editor Agent", role: "Journalistic Writing & Fact Verification", status: "Active", lastRun: new Date().toISOString(), tasksCompleted: 34 },
    media: { name: "Media Agent", role: "Dynamic Graphics & Banner Visuals", status: "Active", lastRun: new Date().toISOString(), tasksCompleted: 34 },
    social: { name: "Social Agent", role: "X / LinkedIn / Instagram Distribution", status: "Active", lastRun: new Date().toISOString(), tasksCompleted: 102 },
    newsletter: { name: "Newsletter Agent", role: "Volt Dispatch Compiler", status: "Active", lastRun: new Date().toISOString(), tasksCompleted: 12 }
  },
  agentLogs: [
    { id: "log-1", timestamp: new Date(Date.now() - 3600000).toISOString(), agent: "Scout Agent", level: "INFO", message: "Scanned 14 global EV feeds and Indian Ministry of Heavy Industries press releases." },
    { id: "log-2", timestamp: new Date(Date.now() - 3300000).toISOString(), agent: "Editor Agent", level: "SUCCESS", message: "Drafted deep-dive on 800V Silicon Carbide inverters in upcoming Indian EVs." },
    { id: "log-3", timestamp: new Date(Date.now() - 3100000).toISOString(), agent: "Media Agent", level: "SUCCESS", message: "Rendered high-contrast editorial banner graphic for Silicon Carbide article." },
    { id: "log-4", timestamp: new Date(Date.now() - 2900000).toISOString(), agent: "Social Agent", level: "INFO", message: "Queued 3 tailored posts for X, LinkedIn, and Instagram carousel." }
  ],
  articles: [
    {
      id: "art-1",
      slug: "tata-motors-nvidia-drive-thor-800v-platform-india",
      title: "Tata Motors Partners with Nvidia for 'Thor' AI Platform & 800V Architecture in Next-Gen EVs",
      summary: "India's leading EV automaker unveils its next-generation dedicated skateboard platform with Nvidia DRIVE Thor compute, enabling Level 2+ autonomy and ultra-fast 12-minute charging.",
      category: "Semiconductors",
      region: "India",
      pillar: "Formula 1 Telemetry & Compute",
      tags: ["Tata Motors", "Nvidia Thor", "800V Architecture", "Autonomous", "India EV"],
      telemetry: {
        acceleration0100: "3.8s",
        peakKwCharging: "350 kW",
        thermalScore: "98.2%",
        dragCd: "0.228"
      },
      communityVerdict: "r/electricvehicles: 'Consolidating 40+ legacy microcontrollers into a single Nvidia DRIVE Thor SoC is the architecture leap Indian EVs needed. 800V SiC charging in 12 minutes puts it on par with the best global platforms.'",
      bbcTakeaway: "BBC Technology: Indigenous semiconductor packaging in Sanand marks India's decisive pivot from vehicle assembly to sovereign automotive IP.",
      author: "Arjun Mehta",
      authorRole: "Senior Automotive Tech Editor",
      readTime: "5 min read",
      publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      featured: true,
      status: "published",
      views: 4210,
      likes: 318,
      heroImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
      takeaways: [
        "Tata Passenger Electric Mobility (TPEM) integrates Nvidia's 2000-teraflop DRIVE Thor central compute SoC.",
        "New 800V Silicon Carbide (SiC) inverter architecture slashes charging times from 10% to 80% to just 12 minutes.",
        "Production begins at the Sanand manufacturing facility with initial deliveries scheduled across India and Southeast Asia."
      ],
      specs: [
        { label: "Architecture", value: "800V Silicon Carbide (SiC)" },
        { label: "Central Compute", value: "Nvidia DRIVE Thor (2,000 TOPS)" },
        { label: "DC Fast Charge", value: "10% to 80% in 12 mins (350 kW)" },
        { label: "Range (ARAI est.)", value: "620 km per charge" }
      ],
      content: `The Indian electric mobility landscape just took an exponential technological leap. Tata Motors' electric passenger division, TPEM, has confirmed an expansive engineering partnership with Nvidia to embed the cutting-edge **DRIVE Thor platform** across its upcoming premium electric SUV lineup.

### The Shift to Centralized Compute and 800V SiC
Historically, mainstream production vehicles utilized dozens of fragmented electronic control units (ECUs) to manage everything from powertrain telemetry to infotainment. The new platform consolidates all autonomous driving, active safety, digital cockpit, and battery monitoring into a single monolithic computing cluster powered by Nvidia Thor.

Paired with a homegrown **800-volt Silicon Carbide (SiC)** powertrain co-developed with Tata AutoComp Systems, the vehicle achieves unprecedented thermal efficiency even in high ambient temperatures exceeding 45°C.

### Why This Matters for Global & Indian EV Markets
1. **Indigenous High-Tech Manufacturing**: The modules will be integrated and packaged at Tata Electronics' emerging semiconductor facilities.
2. **Charging Grid Compatibility**: Compatible with 350kW CCS2 DC fast-chargers, unlocking true inter-city highway transit between Delhi, Mumbai, Bengaluru, and Chennai.
3. **Software-Defined Architecture**: Fleet updates over-the-air (OTA) will continuously improve energy management algorithms based on real-world Indian traffic patterns.`,
      faqs: [
        { q: "What is Nvidia DRIVE Thor?", a: "Nvidia Thor is a next-generation centralized automotive computer delivering up to 2,000 teraflops of FP8 performance for both autonomous driving and in-vehicle AI." },
        { q: "When will the first vehicles hit the road?", a: "Pre-series trial production is slated for late 2026, with customer deliveries rolling out early 2027." }
      ],
      social: {
        x: "🚨 BREAKING: Tata Motors taps @nvidia DRIVE Thor (2,000 TOPS) + 800V SiC platform for its next-gen EV skateboard!\n\n⚡ 10-80% charge in 12 mins\n⚡ 620 km range\n⚡ Full Level 2+ autonomy built for Indian roads\n\nFull technical deep-dive: https://voltdrives.tv/article/tata-motors-nvidia-drive-thor-800v-platform-india\n\n#TataMotors #EV #Nvidia #AutomotiveTech",
        linkedin: "Autonomous compute meets high-voltage Silicon Carbide: Tata Motors' latest technical alliance with Nvidia marks a watershed moment for India's domestic EV manufacturing ecosystem.\n\nKey takeaways for automotive executives:\n• Centralization: Consolidating 40+ legacy ECUs into a single Thor cluster.\n• 800V Thermal Resilience: Optimized specifically for tropical operating climates.\n• Strategic semiconductor self-reliance.\n\nWhat are your thoughts on Nvidia's expanding footprint in Indian automotive? Read the full analysis at VoltDrives.",
        instagram: "SLIDE 1: Tata Motors x NVIDIA Thor ⚡ The 800V Revolution\nSLIDE 2: 2,000 TOPS Compute power replacing 40+ microcontrollers\nSLIDE 3: 12-Minute Ultra Fast Charging (10% to 80%)\nSLIDE 4: 620 KM Estimated Range on single charge\nSLIDE 5: Manufactured in India for global standards. Link in bio for full specs!"
      }
    },
    {
      id: "art-2",
      slug: "catl-shenxing-plus-lfp-battery-1000km-range",
      title: "CATL Unveils Shenxing Plus: 1,000 km Range LFP Battery with 4C Fast Charging",
      summary: "The world's biggest battery maker proves Lithium Iron Phosphate isn't hitting a ceiling, introducing 1,000 km range and 1 km per second charging speed in an ultra-cost-effective package.",
      category: "Batteries",
      region: "Global",
      tags: ["CATL", "LFP Battery", "Fast Charging", "Shenxing Plus", "Energy Storage"],
      author: "Dr. Elena Rostova",
      authorRole: "Battery Chemistry Contributor",
      readTime: "4 min read",
      publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      featured: true,
      status: "published",
      views: 3840,
      likes: 275,
      heroImage: "https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=1200&q=80",
      takeaways: [
        "Energy density reaches 205 Wh/kg at the pack level, unprecedented for standard LFP chemistry.",
        "Proprietary 3D honeycomb cathode architecture enhances lithium-ion extraction kinetics.",
        "Provides 600 km of driving range in just 10 minutes of charging (1 km/sec replenishment)."
      ],
      specs: [
        { label: "Chemistry", value: "Lithium Iron Phosphate (LFP) with 3D Cathode" },
        { label: "Pack Energy Density", value: "205 Wh/kg" },
        { label: "Max Range", value: "1,000 km (CLTC)" },
        { label: "Charge Rate", value: "4C (600 km in 10 minutes)" }
      ],
      content: `Contemporary Amperex Technology Co. Limited (CATL) has officially debuted the **Shenxing Plus**, representing the world's first LFP battery capable of delivering a 1,000-kilometer range alongside true 4C supercharging.

### Breakthrough Cathode Nanotechnology
For years, automotive engineers viewed Lithium Iron Phosphate (LFP) as the budget-friendly, fire-safe, but range-limited alternative to Nickel Manganese Cobalt (NMC). CATL has defied that trade-off by introducing:
- **Continuous 3D Honeycomb material** to optimize lithium-ion pathways.
- **Granular surface coating** that minimizes interfacial resistance during high-voltage spikes.
- **CTP 3.0 (Cell-to-Pack)** structural casing that boosts volumetric utilization by 7%.

### Global Market Consequences
Automakers worldwide from Tesla and Ford to Hyundai are racing to drive down entry-level EV price points without triggering consumer range anxiety. Shenxing Plus offers a cost curve roughly 30% below equivalent ternary NMC packs while solving cold-weather performance degradation through an intelligent thermal envelope.`,
      faqs: [
        { q: "What makes LFP safer than standard lithium-ion batteries?", a: "LFP batteries possess higher chemical stability and a significantly higher thermal runaway temperature (approx. 270°C vs 150°C for NMC), making catastrophic fires virtually negligible." }
      ],
      social: {
        x: "🔋 1,000 KM range on LFP? CATL just unveiled the Shenxing Plus!\n\n⚡ 205 Wh/kg pack density\n⚡ 600 km in 10 mins (1 km / sec)\n⚡ 30% cheaper than NMC chemistry\n\nFull teardown: https://voltdrives.tv/article/catl-shenxing-plus-lfp-battery-1000km-range\n\n#Batteries #CATL #EVTech #EnergyStorage",
        linkedin: "The energy density ceiling for LFP has officially been shattered. CATL's Shenxing Plus achieves 205 Wh/kg and 1,000 km range without costly cobalt or nickel.\n\nThis fundamentally alters the total cost of ownership (TCO) equation for mass-market EVs across Europe, the US, and emerging Asian markets.\n\nAre solid-state batteries at risk of being leapfrogged by hyper-evolved LFP? Share your insights.",
        instagram: "CATL SHENXING PLUS 🔋\n\n✅ 1,000 KM Range on a single charge\n✅ 600 KM added in 10 minutes\n✅ Zero Cobalt, Zero Nickel\n\nThe most affordable battery tech just became the longest-range battery tech on Earth. Read more on VoltDrives!"
      }
    },
    {
      id: "art-3",
      slug: "india-nhai-megawatt-charging-corridors-commercial-ev-trucks",
      title: "India NHAI Green Corridors: 250 MW Fast Charging Network Announced for Commercial Heavy Fleets",
      summary: "The National Highways Authority of India partners with state grid operators to install 1.2 MW Megawatt Charging Systems (MCS) every 80 km along the Golden Quadrilateral.",
      category: "Charging",
      region: "India",
      tags: ["Charging Infra", "NHAI", "Commercial Fleets", "Megawatt Charging", "India"],
      author: "Kavita Ramachandran",
      authorRole: "Infrastructure & Grid Policy Analyst",
      readTime: "6 min read",
      publishedAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
      featured: false,
      status: "published",
      views: 2950,
      likes: 189,
      heroImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      takeaways: [
        "NHAI earmarks 150 highway rest hubs for heavy-duty electric trucks and inter-city luxury buses.",
        "Equipped with MCS (Megawatt Charging System) couplers capable of up to 1,200 kW peak output.",
        "Supported by captive 2 MW solar carports and localized BESS (Battery Energy Storage Systems) to buffer the grid."
      ],
      specs: [
        { label: "Corridor Length", value: "5,846 km (Golden Quadrilateral)" },
        { label: "Max Charger Power", value: "1.2 MW (MCS standard)" },
        { label: "Spacing Interval", value: "Every 75-80 km" },
        { label: "Captive Solar BESS", value: "2 MWh per station" }
      ],
      content: `Heavy commercial road freight accounts for over 45% of India's transport fuel consumption despite representing less than 6% of registered vehicles. In a decisive push toward decarbonizing long-haul logistics, the **National Highways Authority of India (NHAI)** has unveiled the *Megawatt Highway Grid Initiative*.

### Tackling The Grid Challenge with BESS
Connecting 1.2 MW chargers to rural highway sub-stations poses severe voltage destabilization risks. To mitigate this:
1. Every station integrates a **2 MWh localized Battery Energy Storage System (BESS)**.
2. Stations charge storage units during daytime solar surplus peaks and off-peak nocturnal hours.
3. Truck drivers can fully recharge 40-tonne electric tractors in 30 minutes, seamlessly aligning with mandated mandatory driver rest intervals.`,
      faqs: [
        { q: "What is MCS?", a: "MCS stands for Megawatt Charging System, a global standardized connector designed for commercial electric vehicles capable of delivering up to 3.75 MW of DC power." }
      ],
      social: {
        x: "🚛 Massive boost for commercial EV freight in India! NHAI greenlights 1.2 MW Megawatt Charging Systems (MCS) across 5,800+ km.\n\n⚡ 30 min full charge for 40-tonne trucks\n⚡ Captive solar + 2 MWh BESS\n\nDetails: https://voltdrives.tv/article/india-nhai-megawatt-charging-corridors-commercial-ev-trucks\n\n#Logistics #EVIndia #NHAI #CleanEnergy",
        linkedin: "Heavy-duty electric trucking has faced one major bottleneck in India: high-voltage charging infrastructure along key freight routes. NHAI's new 250 MW grid plan solves this directly with Megawatt Charging Systems.\n\nKey takeaway: Localized BESS storage avoids overloading regional distribution grids while providing sub-30 minute turnarounds.",
        instagram: "INDIA'S MEGAWATT HIGHWAY CHARGERS ⚡🚛\n\n• 1.2 MW chargers for heavy freight\n• Golden Quadrilateral coverage\n• 30-minute truck recharge\n• Solar powered battery backups\n\nIs diesel trucking nearing the finish line? Read our in-depth report on VoltDrives."
      }
    },
    {
      id: "art-4",
      slug: "silicon-carbide-chips-gallium-nitride-ev-inverters-power-electronics",
      title: "Silicon Carbide (SiC) vs GaN: The Semiconductor Battle Powering Next-Gen 900V Inverters",
      summary: "Wide-bandgap semiconductors are fundamentally replacing legacy silicon IGBTs in automotive traction inverters, boosting range by 8% and reducing heat dissipation by half.",
      category: "Semiconductors",
      region: "Global",
      tags: ["Semiconductors", "Silicon Carbide", "GaN", "Power Electronics", "STMicro", "Infineon"],
      author: "Marcus Vance",
      authorRole: "Chief Technology Analyst",
      readTime: "7 min read",
      publishedAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
      featured: false,
      status: "published",
      views: 3120,
      likes: 240,
      heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      takeaways: [
        "SiC MOSFETs enable 99% inverter efficiency compared to 95% for conventional silicon.",
        "Automakers save 5-8% battery capacity for the same range, saving hundreds of dollars per pack.",
        "Gallium Nitride (GaN) emerges as the leader for on-board DC-DC converters and bidirectional V2G units."
      ],
      specs: [
        { label: "Bandgap Energy (SiC)", value: "3.26 eV (vs 1.12 eV for Si)" },
        { label: "Switching Frequency", value: "Up to 10x higher" },
        { label: "Thermal Conductivity", value: "3x higher than Silicon" },
        { label: "Efficiency Gain", value: "+5% to +8% vehicle range" }
      ],
      content: `As battery chemistry advances incrementally, automotive powertrains are finding their biggest efficiency leaps in solid-state physics: **Wide-Bandgap (WBG) semiconductors**.

### Why Silicon Is Reaching Physical Limits
Traditional silicon IGBTs (Insulated Gate Bipolar Transistors) suffer from severe thermal losses at high voltages (800V-1000V). Silicon Carbide (SiC) possesses a critical electric field breakdown that is ten times higher than silicon, enabling thinner drift layers and dramatically lower on-resistance.

### The Role of GaN in Bidirectional V2G
While SiC dominates high-voltage traction drive inverters, **Gallium Nitride (GaN)** is dominating on-board chargers (OBC) and 48V auxiliary micro-hybrids. GaN switches at megahertz frequencies, allowing engineers to shrink magnetic transformers by 70%.`,
      faqs: [
        { q: "Why is SiC more expensive than regular silicon?", a: "Growing Silicon Carbide single-crystal ingots requires extreme temperatures (over 2,400°C) and takes weeks per boule, compared to silicon which can be grown in days." }
      ],
      social: {
        x: "⚡ The silent EV revolution is happening inside chips: Silicon Carbide (SiC) & GaN are unlocking +8% more range and 99% inverter efficiency.\n\nHere is how wide-bandgap semiconductors work: https://voltdrives.tv/article/silicon-carbide-chips-gallium-nitride-ev-inverters-power-electronics\n\n#Semiconductors #SiC #GaN #EVPower",
        linkedin: "Power electronics are the single highest ROI efficiency lever in electric mobility right now. Switching from silicon IGBTs to SiC MOSFETs recovers enough lost heat energy to downsize battery packs by 6-8 kWh without sacrificing range.\n\nHere's our full technical breakdown of the SiC vs GaN battle.",
        instagram: "HOW CHIPS SAVE YOUR EV BATTERY 💡🚗\n\nSilicon Carbide (SiC) chips operate at 800V+ with almost ZERO wasted heat.\n• +8% longer range\n• 50% smaller cooling radiators\n• Lightning-fast charging\n\nRead our semiconductor guide on VoltDrives!"
      }
    },
    {
      id: "art-5",
      slug: "solid-state-battery-breakthrough-quantumscape-toyota-commercial-launch",
      title: "Solid-State Batteries Enter Pilot Production: QuantumScape and Toyota Race for 2027 Road Tests",
      summary: "Ceramic separator advancements eliminate dendrite short-circuits, clearing the path for 1,200 km range passenger vehicles that charge in under 10 minutes.",
      category: "Batteries",
      region: "Global",
      tags: ["Solid State", "QuantumScape", "Toyota", "Battery Innovation", "Energy"],
      author: "Dr. Elena Rostova",
      authorRole: "Battery Chemistry Contributor",
      readTime: "5 min read",
      publishedAt: new Date(Date.now() - 1000 * 60 * 1800).toISOString(),
      featured: false,
      status: "published",
      views: 4510,
      likes: 390,
      heroImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
      takeaways: [
        "Anode-less lithium metal design delivers over 400 Wh/kg volumetric energy density.",
        "Solid ceramic electrolyte prevents dendrite puncture, eliminating flammable liquid solvent hazards.",
        "Pilot test fleet entering endurance runs in Germany and Japan."
      ],
      specs: [
        { label: "Energy Density", value: "400+ Wh/kg" },
        { label: "Cycle Life", value: "1,500+ cycles (>80% retention)" },
        { label: "Fast Charge Rate", value: "10% to 80% in 9 minutes" },
        { label: "Electrolyte State", value: "Non-flammable solid ceramic" }
      ],
      content: `The holy grail of electric propulsion—the **anode-free solid-state battery**—is transitioning out of university laboratories and into automated pilot manufacturing lines.

QuantumScape has begun shipping B-samples of its QSE-5 cells to Volkswagen Group's battery division PowerCo, while Toyota reports critical breakthroughs in sulfide-based solid electrolytes for high-temperature resilience.

With non-flammable solid separators, battery packs can operate without heavy, liquid cooling chillers, significantly reducing curb weight and boosting vehicle handling dynamics.`,
      faqs: [
        { q: "What is an anode-less battery?", a: "Instead of manufacturing a carbon or silicon anode, lithium plates directly onto the current collector during the first charge, maximizing energy density." }
      ],
      social: {
        x: "🔋 400+ Wh/kg and non-flammable: Solid-state batteries are officially entering pilot vehicle trials!\n\n⚡ 9-minute full charge\n⚡ Zero liquid electrolyte risk\n⚡ 1,200 km projected range\n\nDeep dive: https://voltdrives.tv/article/solid-state-battery-breakthrough-quantumscape-toyota-commercial-launch\n\n#SolidState #QuantumScape #Toyota #Batteries",
        linkedin: "Commercializing solid-state batteries has been an engineering marathon for over a decade. With QuantumScape's B-samples now in automotive testing, the transition from lab to line is here.\n\nHow will existing gigafactory investments in liquid NMC and LFP adapt to solid electrolytes? Our analysis examines the transition timeline.",
        instagram: "THE END OF BATTERY FIRES 🔥❌\n\nSolid-state batteries replace liquid solvents with solid ceramic separators.\n• 1,200 KM range\n• 9-minute charging\n• 400+ Wh/kg energy density\n\nComing to production vehicles sooner than you think. Learn more on VoltDrives!"
      }
    }
  ],
  newsletters: [
    {
      id: "nl-1",
      issueNumber: 42,
      title: "The Volt Dispatch #42: India's 800V Leap & CATL's LFP Milestone",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      heroBanner: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
      intro: "Welcome to this week's Volt Dispatch. From Silicon Carbide inverters in Pune to 1,000 km battery packs in Ningde, the global mobility transition is breaking every pre-conceived efficiency barrier.",
      stories: [
        "Tata Motors teams up with Nvidia for DRIVE Thor 2,000 TOPS central compute.",
        "CATL reveals Shenxing Plus: 1,000 km range on cobalt-free LFP chemistry.",
        "NHAI deploys 1.2 MW Megawatt Charging Systems across India's freight corridors."
      ],
      marketHighlight: "Lithium carbonate stabilized at $10,450/tonne, while battery pack costs trend toward historic lows of $62/kWh.",
      sentTo: 1420
    }
  ],
  subscribers: [
    { id: "sub-1", email: "tech-leader@mobility.co", subscribedAt: new Date(Date.now() - 86400000 * 5).toISOString(), active: true },
    { id: "sub-2", email: "investor@cleanpower.vc", subscribedAt: new Date(Date.now() - 86400000 * 3).toISOString(), active: true },
    { id: "sub-3", email: "ev-engineer@tatamotors.com", subscribedAt: new Date(Date.now() - 86400000 * 1).toISOString(), active: true }
  ]
};

// Database class
class Database {
  constructor() {
    this.data = initialData;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (e) {
      console.error("Error reading database, using in-memory default:", e);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Error writing database:", e);
    }
  }

  getArticles(filter = {}) {
    let list = [...this.data.articles];
    if (filter.category && filter.category !== 'All') {
      list = list.filter(a => a.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.region && filter.region !== 'All') {
      list = list.filter(a => a.region.toLowerCase() === filter.region.toLowerCase());
    }
    if (filter.status) {
      list = list.filter(a => a.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.summary.toLowerCase().includes(q) ||
        (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    // Sort descending by date
    list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return list;
  }

  getArticleBySlug(slug) {
    return this.data.articles.find(a => a.slug === slug);
  }

  getArticleById(id) {
    return this.data.articles.find(a => a.id === id);
  }

  addArticle(article) {
    if (!article.id) {
      article.id = 'art-' + Date.now();
    }
    if (!article.slug) {
      article.slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (!article.publishedAt) {
      article.publishedAt = new Date().toISOString();
    }
    this.data.articles.unshift(article);
    this.save();
    return article;
  }

  updateArticle(id, updates) {
    const idx = this.data.articles.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.data.articles[idx] = { ...this.data.articles[idx], ...updates };
      this.save();
      return this.data.articles[idx];
    }
    return null;
  }

  deleteArticle(id) {
    const idx = this.data.articles.findIndex(a => a.id === id);
    if (idx !== -1) {
      const deleted = this.data.articles.splice(idx, 1)[0];
      this.save();
      return deleted;
    }
    return null;
  }

  addAgentLog(agent, level, message, details = null) {
    const log = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
      agent,
      level,
      message,
      details
    };
    this.data.agentLogs.unshift(log);
    // Keep max 200 logs
    if (this.data.agentLogs.length > 200) {
      this.data.agentLogs.pop();
    }
    this.save();
    return log;
  }

  getAgentLogs(limit = 50) {
    return this.data.agentLogs.slice(0, limit);
  }

  updateAgentStatus(agentKey, updates) {
    if (this.data.agents[agentKey]) {
      this.data.agents[agentKey] = { ...this.data.agents[agentKey], ...updates };
      this.save();
    }
  }

  getMarketData() {
    return this.data.marketTicker;
  }

  addSubscriber(email) {
    const existing = this.data.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { status: "already_subscribed", subscriber: existing };
    }
    const newSub = {
      id: 'sub-' + Date.now(),
      email,
      subscribedAt: new Date().toISOString(),
      active: true
    };
    this.data.subscribers.push(newSub);
    this.save();
    return { status: "success", subscriber: newSub };
  }

  getSubscribers() {
    return this.data.subscribers;
  }

  getNewsletters() {
    return this.data.newsletters;
  }

  addNewsletter(newsletter) {
    newsletter.id = 'nl-' + Date.now();
    newsletter.date = new Date().toISOString();
    this.data.newsletters.unshift(newsletter);
    this.save();
    return newsletter;
  }

  getSettings() {
    return this.data.settings;
  }

  updateSettings(updates) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }
}

export const db = new Database();
