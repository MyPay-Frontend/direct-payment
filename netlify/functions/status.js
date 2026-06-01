const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS };
  }

  const txId = decodeURIComponent((event.path.split('/status/')[1] || '').trim());
  let status = null;

  if (txId) {
    try {
      const store = getStore('transactions');
      status = await store.get(txId);
    } catch (_) {}
  }

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  };
};
