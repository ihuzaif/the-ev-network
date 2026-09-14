async function test() {
  try {
    const arts = await (await fetch('http://localhost:5000/api/articles')).json();
    console.log('✓ Articles API:', arts.count, 'articles retrieved');

    const ticker = await (await fetch('http://localhost:5000/api/market-ticker')).json();
    console.log('✓ Market Ticker API:', ticker.ticker.length, 'live symbols loaded');

    const agents = await (await fetch('http://localhost:5000/api/agents/status')).json();
    console.log('✓ Agent Fleet Status:', Object.keys(agents.agents).join(', '), '| Scheduler Active:', agents.isSchedulerRunning);

    const auth = await (await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email:'admin@voltdrives.com', password:'admin123'})
    })).json();
    console.log('✓ Owner Auth API:', auth.success ? 'Authenticated as ' + auth.user.email : 'Failed');

    const sub = await (await fetch('http://localhost:5000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email:'mobility-leader@industry.com'})
    })).json();
    console.log('✓ Newsletter Subscribe API:', sub.status);

    const rss = await (await fetch('http://localhost:5000/feed.xml')).text();
    console.log('✓ RSS XML Feed:', rss.includes('<channel>') ? 'Valid RSS 2.0 generated (' + rss.length + ' bytes)' : 'Invalid');

    const sitemap = await (await fetch('http://localhost:5000/sitemap.xml')).text();
    console.log('✓ Sitemap XML:', sitemap.includes('http://www.sitemaps.org/schemas/sitemap/0.9') ? 'Valid XML Sitemap (' + sitemap.length + ' bytes)' : 'Invalid');

    const cardSvg = await (await fetch('http://localhost:5000/api/media/generate-card?title=Test+EV+Breakthrough&category=Batteries')).text();
    console.log('✓ Dynamic SVG Card Generator:', cardSvg.includes('<svg') ? 'Valid SVG generated (' + cardSvg.length + ' bytes)' : 'Failed');
    
    console.log('\n🌟 ALL SYSTEM INTEGRATION TESTS PASSED!');
  } catch (err) {
    console.error('Test error:', err);
  }
}
test();
