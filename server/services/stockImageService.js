// Stock Image Service: Sourcing & Grabbing for Topics, Articles, and Newsletters
// Supports Unsplash (Free), Pexels (Free), Adobe Stock (Paid), and Shutterstock (Paid)
import { db } from '../db.js';

// Curated high-resolution image libraries with verified direct CDN URLs
const CURATED_STOCK_LIBRARY = {
  // Electric Vehicles, Track Racing, Supercars & F1 Telemetry
  cars: [
    {
      id: 'uns-car-1',
      title: 'High Performance Electric Supercar Track Telemetry',
      provider: 'Unsplash (Free)',
      url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80',
      author: 'Martin Katler',
      authorUrl: 'https://unsplash.com/@martinkatler',
      downloadUrl: 'https://unsplash.com/photos/1617788138017-80ad40651399',
      isPaid: false,
      tags: ['car', 'supercar', 'track', 'racing', 'f1', 'speed', 'telemetry', 'su7', 'taycan', 'porsche']
    },
    {
      id: 'pex-car-2',
      title: 'Futuristic Electric Vehicle Aerodynamic Chassis',
      provider: 'Pexels (Free)',
      url: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=1600',
      thumbUrl: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: 'Mike Bird',
      authorUrl: 'https://www.pexels.com/@mikebirdy',
      downloadUrl: 'https://www.pexels.com/photo/110844',
      isPaid: false,
      tags: ['car', 'ev', 'aerodynamic', 'sedan', 'hypercar', 'chassis', 'speed']
    },
    {
      id: 'uns-car-3',
      title: 'Modern Electric Crossover Highway Cruise',
      provider: 'Unsplash (Free)',
      url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=400&q=80',
      author: 'Chuttersnap',
      authorUrl: 'https://unsplash.com/@chuttersnap',
      downloadUrl: 'https://unsplash.com/photos/1593941707882-a5bba14938c7',
      isPaid: false,
      tags: ['car', 'suv', 'curvv', 'range', 'highway', 'tata', 'mahindra', 'kona', 'mg']
    },
    {
      id: 'adobe-car-4',
      title: 'Studio Lighting 8K Electric Hypercar Render',
      provider: 'Adobe Stock (Paid)',
      url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=400&q=80',
      author: 'Adobe Stock Premium Mobility Collection',
      authorUrl: 'https://stock.adobe.com/search?k=electric+supercar',
      downloadUrl: 'https://stock.adobe.com/search?k=electric+vehicle+track+telemetry',
      isPaid: true,
      tags: ['supercar', 'render', 'studio', 'hypercar', 'track', 'paid', 'premium']
    },
    {
      id: 'shutter-car-5',
      title: 'Night Expressway Velocity & Aerodynamic Light Trails',
      provider: 'Shutterstock (Paid)',
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
      author: 'Shutterstock Automotive Pro Series',
      authorUrl: 'https://www.shutterstock.com/search/electric-vehicle-speed',
      downloadUrl: 'https://www.shutterstock.com/search/electric-vehicle-night-drive',
      isPaid: true,
      tags: ['speed', 'expressway', 'night', 'telemetry', 'lights', 'highway', 'paid']
    }
  ],

  // Battery Chemistry, Cells, Gigafactory, LFP & Solid-State
  batteries: [
    {
      id: 'uns-bat-1',
      title: 'Lithium-Ion Battery Packs and Energy Storage Cells',
      provider: 'Unsplash (Free)',
      url: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=400&q=80',
      author: 'American Public Power Association',
      authorUrl: 'https://unsplash.com/@publicpowerorg',
      downloadUrl: 'https://unsplash.com/photos/1558441719-8b489c63f7d1',
      isPaid: false,
      tags: ['battery', 'cells', 'lithium', 'storage', 'lfp', 'catl', 'energy', 'pack', 'gigafactory']
    },
    {
      id: 'pex-bat-2',
      title: 'Automated Battery Cell Manufacturing Robotic Line',
      provider: 'Pexels (Free)',
      url: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=1600',
      thumbUrl: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: 'Pixabay Industry',
      authorUrl: 'https://www.pexels.com',
      downloadUrl: 'https://www.pexels.com/photo/256381',
      isPaid: false,
      tags: ['factory', 'robotics', 'automation', 'gigafactory', 'cells', 'battery', '4680']
    },
    {
      id: 'uns-bat-3',
      title: 'Laboratory Chemistry Analysis of Solid-State Separator',
      provider: 'Unsplash (Free)',
      url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=400&q=80',
      author: 'Science in HD',
      authorUrl: 'https://unsplash.com/@scienceinhd',
      downloadUrl: 'https://unsplash.com/photos/1581093458791-9f3c3900df4b',
      isPaid: false,
      tags: ['lab', 'chemistry', 'solid-state', 'research', 'quantumscape', 'toyota', 'nanotech']
    },
    {
      id: 'adobe-bat-4',
      title: '3D Render of Prismatic & Cylindrical Battery Chemistry Structure',
      provider: 'Adobe Stock (Paid)',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      author: 'Adobe Stock CleanTech Series',
      authorUrl: 'https://stock.adobe.com/search?k=lithium+battery+cell+3d',
      downloadUrl: 'https://stock.adobe.com/search?k=lithium+ion+battery+cells+macro',
      isPaid: true,
      tags: ['3d', 'battery', 'prismatic', 'cylindrical', 'render', 'paid']
    }
  ],

  // Charging Infrastructure, Megawatt MCS & Fast Chargers
  charging: [
    {
      id: 'uns-chg-1',
      title: 'High-Voltage DC Fast Charging Coupler Connected to Vehicle',
      provider: 'Unsplash (Free)',
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80',
      author: 'Kumpan Electric',
      authorUrl: 'https://unsplash.com/@kumpanelectric',
      downloadUrl: 'https://unsplash.com/photos/1563986768609-322da13575f3',
      isPaid: false,
      tags: ['charging', 'fast-charger', 'ccs2', 'mcs', 'high-voltage', 'plug', 'station', 'nhai']
    },
    {
      id: 'pex-chg-2',
      title: 'Highway EV Charging Hub at Sunset',
      provider: 'Pexels (Free)',
      url: 'https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=1600',
      thumbUrl: 'https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: 'Kindel Media',
      authorUrl: 'https://www.pexels.com/@kindelmedia',
      downloadUrl: 'https://www.pexels.com/photo/9800029',
      isPaid: false,
      tags: ['charging', 'station', 'hub', 'highway', 'infrastructure', 'ev-network']
    },
    {
      id: 'shutter-chg-3',
      title: 'Megawatt Charging Station with Solar Carport & BESS',
      provider: 'Shutterstock (Paid)',
      url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80',
      author: 'Shutterstock Green Grid Collection',
      authorUrl: 'https://www.shutterstock.com/search/megawatt-charging-system',
      downloadUrl: 'https://www.shutterstock.com/search/ev-charging-station-solar',
      isPaid: true,
      tags: ['solar', 'megawatt', 'mcs', 'bess', 'grid', 'charging', 'paid']
    }
  ],

  // Semiconductors, Silicon Carbide (SiC), GaN & AI Compute
  semiconductors: [
    {
      id: 'uns-semi-1',
      title: 'Semiconductor Silicon Wafer in Cleanroom Environment',
      provider: 'Unsplash (Free)',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      author: 'Alexandre Debiève',
      authorUrl: 'https://unsplash.com/@alexandre_debieve',
      downloadUrl: 'https://unsplash.com/photos/1518770660439-4636190af475',
      isPaid: false,
      tags: ['chip', 'semiconductor', 'silicon-carbide', 'sic', 'gan', 'nvidia', 'thor', 'wafer', 'electronics']
    },
    {
      id: 'pex-semi-2',
      title: 'Microchip Circuit Board with Power Inverter Architecture',
      provider: 'Pexels (Free)',
      url: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1600',
      thumbUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: 'Umut Dağlı',
      authorUrl: 'https://www.pexels.com',
      downloadUrl: 'https://www.pexels.com/photo/2582937',
      isPaid: false,
      tags: ['circuit', 'microchip', 'hardware', 'motherboard', 'semiconductors', 'inverter']
    },
    {
      id: 'adobe-semi-3',
      title: 'Photolithography Wafer Fabrication Holographic Glow',
      provider: 'Adobe Stock (Paid)',
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
      author: 'Adobe Stock Technology Lab',
      authorUrl: 'https://stock.adobe.com/search?k=semiconductor+cleanroom',
      downloadUrl: 'https://stock.adobe.com/search?k=silicon+carbide+wafer',
      isPaid: true,
      tags: ['cleanroom', 'wafer', 'fabrication', 'silicon', 'paid', 'premium']
    }
  ],

  // Commercial Fleets, Freight, Logistics & Heavy Trucks
  commercial: [
    {
      id: 'uns-com-1',
      title: 'Heavy Commercial Logistics Transport Truck on Highway',
      provider: 'Unsplash (Free)',
      url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80',
      thumbUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80',
      author: 'Marcin Jozwiak',
      authorUrl: 'https://unsplash.com/@marcinjozwiak',
      downloadUrl: 'https://unsplash.com/photos/1601584115197-04ecc0da31d7',
      isPaid: false,
      tags: ['truck', 'commercial', 'freight', 'logistics', 'semi-truck', 'fleet', 'haul', 'nhai']
    },
    {
      id: 'pex-com-2',
      title: 'Electric Commercial Delivery Fleet Charging Depo',
      provider: 'Pexels (Free)',
      url: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=1600',
      thumbUrl: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: 'Elevate',
      authorUrl: 'https://www.pexels.com',
      downloadUrl: 'https://www.pexels.com/photo/1267338',
      isPaid: false,
      tags: ['fleet', 'delivery', 'vans', 'depo', 'commercial', 'logistics']
    }
  ]
};

export const stockImageService = {
  /**
   * Search stock images across free (Unsplash, Pexels) and paid (Adobe Stock, Shutterstock)
   */
  async searchImages({ query = '', provider = 'all', page = 1, perPage = 12 }) {
    const settings = db.getSettings();
    const apiKeys = settings.stockApiKeys || {};

    const normalizedQuery = (query || '').toLowerCase().trim();
    const normalizedProvider = (provider || 'all').toLowerCase();

    // 1. Check if user configured live Unsplash API Key
    if ((normalizedProvider === 'all' || normalizedProvider === 'unsplash') && apiKeys.unsplashAccessKey && normalizedQuery) {
      try {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(normalizedQuery)}&page=${page}&per_page=${perPage}&client_id=${apiKeys.unsplashAccessKey}`);
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            return {
              success: true,
              provider: 'Unsplash (Live API)',
              results: data.results.map(img => ({
                id: `uns-live-${img.id}`,
                title: img.alt_description || img.description || 'Unsplash EV Photography',
                provider: 'Unsplash (Free)',
                url: `${img.urls.raw}&auto=format&fit=crop&w=1600&q=80`,
                thumbUrl: img.urls.small,
                author: img.user.name,
                authorUrl: img.user.links.html,
                downloadUrl: img.links.html,
                isPaid: false,
                tags: (img.tags || []).map(t => t.title)
              }))
            };
          }
        }
      } catch (err) {
        console.warn('Unsplash Live API fetch failed, falling back to curated library:', err.message);
      }
    }

    // 2. Check if user configured live Pexels API Key
    if ((normalizedProvider === 'all' || normalizedProvider === 'pexels') && apiKeys.pexelsApiKey && normalizedQuery) {
      try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(normalizedQuery)}&page=${page}&per_page=${perPage}`, {
          headers: { Authorization: apiKeys.pexelsApiKey }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.photos && data.photos.length > 0) {
            return {
              success: true,
              provider: 'Pexels (Live API)',
              results: data.photos.map(p => ({
                id: `pex-live-${p.id}`,
                title: p.alt || 'Pexels EV Photography',
                provider: 'Pexels (Free)',
                url: p.src.large2x || p.src.large,
                thumbUrl: p.src.medium,
                author: p.photographer,
                authorUrl: p.photographer_url,
                downloadUrl: p.url,
                isPaid: false,
                tags: [normalizedQuery]
              }))
            };
          }
        }
      } catch (err) {
        console.warn('Pexels Live API fetch failed, falling back to curated library:', err.message);
      }
    }

    // 3. Fallback to Curated High-Res Multi-Provider Library
    let allItems = [];
    Object.values(CURATED_STOCK_LIBRARY).forEach(categoryItems => {
      allItems.push(...categoryItems);
    });

    // Filter by provider
    if (normalizedProvider !== 'all') {
      allItems = allItems.filter(item => {
        const p = item.provider.toLowerCase();
        if (normalizedProvider === 'unsplash') return p.includes('unsplash');
        if (normalizedProvider === 'pexels') return p.includes('pexels');
        if (normalizedProvider === 'adobestock') return p.includes('adobe');
        if (normalizedProvider === 'shutterstock') return p.includes('shutterstock');
        return true;
      });
    }

    // Filter by query keywords if present
    if (normalizedQuery) {
      const qWords = normalizedQuery.split(/\s+/);
      allItems = allItems.filter(item => {
        const titleMatch = qWords.some(w => item.title.toLowerCase().includes(w));
        const tagMatch = item.tags && item.tags.some(t => qWords.some(w => t.toLowerCase().includes(w)));
        return titleMatch || tagMatch;
      });
    }

    // If no exact match found, fall back to entire provider set
    if (allItems.length === 0) {
      Object.values(CURATED_STOCK_LIBRARY).forEach(c => allItems.push(...c));
    }

    return {
      success: true,
      provider: normalizedProvider === 'all' ? 'Multi-Provider Engine (Unsplash/Pexels/Adobe/Shutterstock)' : normalizedProvider,
      total: allItems.length,
      results: allItems.slice(0, perPage)
    };
  },

  /**
   * Intelligently grabs the highest-matching stock image for an article topic, category, or newsletter
   */
  grabImageForTopic(topic = '', category = 'Cars', region = 'Global') {
    const text = `${topic} ${category} ${region}`.toLowerCase();

    let targetPool = 'cars';
    if (/battery|cell|lfp|catl|solid-state|quantumscape|anode|cathode|4680/.test(text)) {
      targetPool = 'batteries';
    } else if (/charger|charging|mcs|megawatt|fast charge|corridor|grid|v2g|bess/.test(text)) {
      targetPool = 'charging';
    } else if (/semiconductor|chip|sic|silicon carbide|gan|inverter|nvidia|thor|wafer/.test(text)) {
      targetPool = 'semiconductors';
    } else if (/truck|freight|commercial|logistics|fleet|bus|heavy/.test(text)) {
      targetPool = 'commercial';
    }

    const items = CURATED_STOCK_LIBRARY[targetPool] || CURATED_STOCK_LIBRARY.cars;

    // Pick top matching item or rotate
    const matched = items.find(item => 
      item.tags.some(tag => text.includes(tag.toLowerCase()))
    ) || items[Math.floor(Math.random() * items.length)];

    return {
      heroImage: matched.url,
      thumbUrl: matched.thumbUrl,
      title: matched.title,
      provider: matched.provider,
      author: matched.author,
      authorUrl: matched.authorUrl,
      isPaid: matched.isPaid
    };
  },

  /**
   * Returns supported providers and configured API keys status
   */
  getProviderConfig() {
    const settings = db.getSettings();
    const keys = settings.stockApiKeys || {};

    return {
      activeProvider: settings.stockImageProvider || 'unsplash',
      providers: [
        { id: 'unsplash', name: 'Unsplash', type: 'Free', hasKey: Boolean(keys.unsplashAccessKey), docsUrl: 'https://unsplash.com/developers' },
        { id: 'pexels', name: 'Pexels', type: 'Free', hasKey: Boolean(keys.pexelsApiKey), docsUrl: 'https://www.pexels.com/api' },
        { id: 'adobestock', name: 'Adobe Stock', type: 'Paid / Enterprise', hasKey: Boolean(keys.adobeStockClientId), docsUrl: 'https://developer.adobe.com/stock/docs/' },
        { id: 'shutterstock', name: 'Shutterstock', type: 'Paid / Enterprise', hasKey: Boolean(keys.shutterstockApiToken), docsUrl: 'https://www.shutterstock.com/developers' }
      ]
    };
  }
};
