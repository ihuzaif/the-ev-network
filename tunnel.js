import localtunnel from 'localtunnel';

const PORT = process.env.PORT || 5000;
const SUBDOMAIN = process.env.SUBDOMAIN || 'the-ev-network';

let activeTunnel = null;
let reconnecting = false;

async function startTunnel() {
  if (reconnecting) return;
  try {
    console.log(`Establishing tunnel to 127.0.0.1:${PORT} (subdomain: ${SUBDOMAIN})...`);
    activeTunnel = await localtunnel({
      port: Number(PORT),
      local_host: '127.0.0.1',
      subdomain: SUBDOMAIN
    });

    console.log(`====================================================`);
    console.log(`⚡ LIVE PUBLIC HTTPS TUNNEL ACTIVE`);
    console.log(`🌐 Live URL: ${activeTunnel.url}`);
    console.log(`====================================================`);

    activeTunnel.on('close', () => {
      console.warn('Tunnel closed by remote gateway. Reconnecting in 3s...');
      reconnect();
    });

    activeTunnel.on('error', (err) => {
      console.error('Tunnel error:', err.message);
      reconnect();
    });

  } catch (err) {
    console.error('Failed to establish tunnel:', err.message);
    reconnect();
  }
}

function reconnect() {
  reconnecting = true;
  try {
    if (activeTunnel) activeTunnel.close();
  } catch (e) {}
  activeTunnel = null;
  setTimeout(() => {
    reconnecting = false;
    startTunnel();
  }, 3000);
}

// Heartbeat interval to keep event loop active indefinitely
setInterval(async () => {
  if (activeTunnel && activeTunnel.url) {
    // Keep-alive heartbeat
    try {
      const res = await fetch('http://127.0.0.1:' + PORT + '/api/market-ticker');
      if (!res.ok) console.warn('Local health check status:', res.status);
    } catch (e) {
      console.warn('Local health check warning:', e.message);
    }
  }
}, 15000);

// Graceful shutdown
process.on('SIGINT', () => {
  if (activeTunnel) activeTunnel.close();
  process.exit(0);
});

startTunnel();
