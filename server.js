/**
 * Demo server for direct-payments-demo-ui
 *
 * Responsibilities:
 *   1. Serve static files (index.html, return.html, config.js, …)
 *   2. POST /webhook  — receives the vendor callback that payment-api sends to
 *                       checkout.redirection after a transaction completes.
 *                       Set your vendor's redirection URL to:
 *                         http://<host>:<PORT>/webhook
 *   3. GET  /status/:transactionId — return.html polls this to get the status
 *                                     that arrived via the webhook.
 *
 * Usage:
 *   node server.js          (default port 5500)
 *   PORT=8080 node server.js
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '3001', 10);

// In-memory store: transactionId (reference) → status string
const statusStore = {};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain',
};

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

http.createServer((req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const urlPath = req.url.split('?')[0];

  // ── Webhook receiver ──────────────────────────────────────────────────────
  // payment-api calls this (checkout.redirection) after a transaction finishes.
  // Body shape (from sendVendorCallback):
  //   { ...transaction, transactionId: checkout.reference, tokenId, paymentInfo }
  //   where transaction contains { status: 'completed' | 'failed' | 'pending', … }
  if (req.method === 'POST' && urlPath === '/webhook') {
    let raw = '';
    req.on('data', chunk => (raw += chunk));
    req.on('end', () => {
      try {
        const body   = JSON.parse(raw);
        const txId   = body.transactionId;
        const status = (body.status ?? body.transaction?.status ?? '').toLowerCase();

        if (txId && status) {
          statusStore[txId] = status;
          console.log(`[webhook] stored  transactionId=${txId}  status=${status}`);
        } else {
          console.warn('[webhook] received payload without transactionId or status', body);
        }
      } catch (e) {
        console.error('[webhook] JSON parse error:', e.message);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  // ── Status query ──────────────────────────────────────────────────────────
  // return.html polls: GET /status/<transactionId>
  // Returns: { status: 'completed' | 'failed' | 'pending' | null }
  if (req.method === 'GET' && urlPath.startsWith('/status/')) {
    const txId  = decodeURIComponent(urlPath.slice('/status/'.length));
    const status = statusStore[txId] ?? null;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status }));
  }

  // ── Static file server ────────────────────────────────────────────────────
  const relPath  = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
  const filePath = path.join(__dirname, relPath);
  const ext      = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });

}).listen(PORT, () => {
  console.log(`\n  Demo UI   →  http://localhost:${PORT}`);
  console.log(`  Webhook   →  POST http://localhost:${PORT}/webhook   ← set as checkout.redirection`);
  console.log(`  Status    →  GET  http://localhost:${PORT}/status/:transactionId\n`);
});
