const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS };
  }

  try {
    const body   = JSON.parse(event.body || '{}');
    console.log('[webhook] received payload:\n', JSON.stringify(body, null, 2));
    const txId   = body.transactionId;
    const status = (body.status ?? body.transaction?.status ?? '').toLowerCase();

    if (txId && status) {
      const store = getStore('transactions');
      await store.set(txId, status);
    }
  } catch (_) {}

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  };
};
