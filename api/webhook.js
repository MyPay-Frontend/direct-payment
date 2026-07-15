// Vercel serverless function - POST /api/webhook
// payment-api calls this (checkout.redirection) after a transaction finishes.
// This endpoint only accepts + logs the callback; it deliberately does NOT try to
// cache the result in memory for return.html to poll later, because serverless
// functions are stateless across invocations - a webhook handled by one instance
// is invisible to a later /status request handled by a different (or cold-started)
// instance. return.html instead polls payment-api's own transaction-status endpoint
// directly, which is the one place this data is actually persisted.
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  console.log('[webhook] received payload:', JSON.stringify(req.body));

  return res.status(200).json({ success: true });
};
