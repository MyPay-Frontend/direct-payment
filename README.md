# Direct Payments Demo UI (Standalone)

This is a standalone custom HTML/JS demo UI that calls your `payment-api` direct endpoints:

- `POST /v1/payments/session`
- `POST /v1/payments/submit-phone`
- `POST /v1/payments/generate-otp`
- `POST /v1/payments/verify-otp`
- `POST /v1/payments/initiate-link`
- `GET  /v1/payments/transactions/:transactionId`

## 1) Configure

Edit `config.js` (or copy from `config.example.js`):

- `backendBaseUrl`
- `mycoApiKey`
- `mycoPrivateKeyB64` (base64-encoded PEM from your backend `.env`)
- `demoUserId`
- `demoVendorId` (used by polling endpoint as `vendorId` query param)

## 2) Run

Any static server is fine. For example, if you have Node installed:

```bash
npx http-server -p 5173
```

Then open:

- `http://localhost:5173/index.html`
- `http://localhost:5173/return.html`

## Notes

- This demo exposes signing private key to the browser (same behavior as your previous HBS demo). Do not use this approach in production.

