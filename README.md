# RONALD E-LOADING BUSINESS STATION — Retailer Portal

This package updates the existing project and keeps the existing customer order endpoints and Telegram workflow in `server.js`. The retailer portal is `retailer.html`.

## Included retailer backend features
- PostgreSQL-backed retailer accounts, hashed passwords (`scrypt`), hashed bearer-session tokens, and 30-day sessions.
- Retailer balance endpoint and per-retailer transaction history.
- Top-up requests with JPG/PNG screenshot stored in PostgreSQL (max 5 MB).
- Admin-only top-up review page at `/retailer-admin`; approval uses a database transaction and a unique wallet-ledger transaction ID to prevent double credit.
- Top-up approval/rejection endpoints require `ADMIN_KEY`.
- Manila-local formatted transaction times.

## Important limitations
- Retailer network tiles are currently dashboard navigation only. Retailer loading orders are **not yet connected** to wallet debit or to an integrated retailer sales flow. Do not use the displayed balance as a production sales wallet until that flow is implemented and tested.
- The ZIP does not contain payment QR image assets, so no QR images have been invented.
- The existing customer order/Telegram workflow has been preserved in code but has not been live-regression-tested in this environment.
- This project has not been tested against a live Render service or live PostgreSQL database.

## GitHub upload
1. Download and extract this ZIP on your computer.
2. Open the repository `https://github.com/RonaldEloadingBusinessStation/RONALD-RETAILER-PORTAL`.
3. Upload the *contents* of the extracted `RONALD-RETAILER-PORTAL-main` folder to the repository root (not the ZIP itself).
4. Commit changes to the `main` branch. Ensure `.env` is never uploaded. `.env.example` is safe as a template.

## Render setup
Create a **new Web Service** connected to the repository.
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Node version: 20 or newer

Create a Render PostgreSQL database, then copy its **Internal Database URL** into the web service's `DATABASE_URL` environment variable when the web service and database are in the same Render region. Keep the URL private.

Set these Environment Variables on the Render web service:
- `DATABASE_URL` = Render PostgreSQL connection string
- `ADMIN_KEY` = a long random secret (do not share or commit)
- `TELEGRAM_BOT_TOKEN` = existing bot token, if using Telegram workflow
- `TELEGRAM_CHAT_ID` = existing Telegram chat ID, if using Telegram workflow
- `NODE_ENV` = `production` (optional)

Do not paste secrets into GitHub files or public chat. The app creates retailer database tables on startup. Never set `DATABASE_SSL=false` on a public production database.

## Frontend API URL
The retailer page defaults to `https://ronald-retailer-portal.onrender.com`. If your Render service URL is different, open the retailer page in the browser and run this in the browser console before refreshing:

```js
localStorage.setItem('ronaldBackendUrl', 'https://YOUR-REAL-RENDER-SERVICE.onrender.com');
location.reload();
```

Replace the example hostname with the exact URL shown on your Render service. Do not include a trailing slash.

## Create a retailer account
After deployment, open the retailer portal, choose **CREATE RETAILER**, and enter the `ADMIN_KEY` set in Render. Create a unique username and a strong password (at least 10 characters). There is no public/default admin password.

## Review top-ups
Open `https://YOUR-REAL-RENDER-SERVICE.onrender.com/retailer-admin`, enter the private `ADMIN_KEY`, and load requests. Inspect the screenshot and payment details. Approve only after independently verifying that the money was received. Approval credits the balance once; repeated approval requests will not credit it again.

## Test checklist after deployment
1. Open `/api/health`; confirm `ok: true` and `retailerDatabaseConfigured: true`.
2. Create a test retailer with zero balance.
3. Log in and confirm `/api/retailer/me` returns the account and balance.
4. Submit a small test top-up with a valid screenshot. Confirm it shows `PENDING VERIFICATION` and the balance is unchanged.
5. Open `/retailer-admin`, inspect the screenshot, then approve only if you actually made and verified a test payment. Confirm the balance changes once. Refresh and repeat the approval request; balance must not change again.
6. Test rejection with a separate request.
7. Check transaction history and Asia/Manila time.
8. Re-test customer orders and Telegram receipts, since they must remain working.

## Local development
1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and set valid local PostgreSQL credentials and private secrets.
3. Run `npm install`, then `npm start`.
4. Never commit `.env`.
