// Copy to `config.js` and fill values.
// Keys are the same demo values that were previously injected into Handlebars templates.
window.DIRECT_PAYMENTS_DEMO_CONFIG = {
  // Backend base URL (no trailing slash)
  backendBaseUrl: 'http://localhost:3002',

  // Vendor API credentials (must exist in DB and beActive).
  // IMPORTANT: This is demo UI; exposing private key in frontend is not safe for production.
  mycoApiKey: 'YOUR_MYCO_API_KEY',
  // MYCO_PRIVATE_KEY value from backend .env (base64-encoded PEM)
  mycoPrivateKeyB64: 'YOUR_MYCO_PRIVATE_KEY_B64',

  // Demo user id to attach to checkout
  demoUserId: '69ca5305fabe1b10efe340db',

  // UI base URL (where index.html + return.html are served)
  // IMPORTANT: must be http/https, never file://
  uiBaseUrl: 'http://localhost:5173',

  // Used by transaction polling endpoint query param.
  // If you don't know it, you can set it to your vendor id (the one used with X-Api-Key).
  demoVendorId: 'b1f7d7a2-d6eb-4cef-8f3e-d2b19b2d8e82',
};

