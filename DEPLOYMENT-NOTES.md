# Ronald Retailer Portal — deployment notes

## Retailer page
After deploying this repository to Render, open:
https://ronald-retailer-portal-1.onrender.com/retailer.html

The retailer page's default API URL is now configured for that Render service. If the backend hostname changes, update the `API` constant near the top of the inline script in `retailer.html`.

## Render commands
- Build command: `npm install`
- Start command: `npm start`
- `NODE_ENV=production`
- `ADMIN_KEY`: set a long random secret in Render. Do not commit it or share it in chat.
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`: set only if the existing Telegram workflow is required.

## Important limitations — do not use for live wallet funds yet
The retailer endpoints in this archive currently store retailer accounts, sessions, and top-up transactions in JSON files (`retailers.json`, `retailer-sessions.json`, and `retailer-transactions.json`). Although `DATABASE_URL` may be set in Render, this version does not use it for retailer storage. Render's normal ephemeral filesystem can lose those files after a restart or redeploy. This does NOT meet the requested persistent PostgreSQL database requirement.

Top-up requests are recorded as pending verification, but there is no complete admin approval/rejection dashboard. An approval endpoint exists at `POST /api/admin/retailer-topups/:id/approve` and requires `x-admin-key`, but it updates JSON files without database transactions/locking, so it is not safe for real wallet funds or concurrent approvals. Retailer product ordering and wallet deductions are also not integrated.

Before handling real balances, migrate retailer accounts, sessions, transactions and top-up requests to PostgreSQL and use atomic database transactions/row locking for approval and deductions. Payment QR assets are not included in this archive except for the existing `eloading.jpg`; confirm the actual QR files before enabling top-up payments.

## Checks performed
- `node --check server.js` — passed.
- `node --check script.js` — passed.
- Static inspection confirmed the retailer API URLs exist in `server.js` and the page points to the supplied Render hostname.
- Not tested end-to-end: live login, PostgreSQL persistence, top-up screenshot upload, admin approval/rejection, Telegram, or customer ordering against the deployed service.
