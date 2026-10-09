# Ronald E-Loading — Telegram Notifications

This version sends website order submissions to your Telegram chat through a Telegram Bot.

## IMPORTANT SECURITY
Do NOT put your Telegram bot token in `index.html`, `script.js`, or any public GitHub repository.
The bot token belongs only in `.env`.

If a bot token was posted publicly or shared in a chat, revoke it with BotFather and create a new token.

## Setup

1. Install Node.js.
2. Open this folder in VS Code.
3. Run:
   `npm install`
4. Copy `.env.example` to `.env`.
5. Put your NEW Telegram bot token in:
   `TELEGRAM_BOT_TOKEN=`
6. Put your Telegram personal chat ID in:
   `TELEGRAM_CHAT_ID=`
7. Start:
   `npm start`
8. Open:
   `http://localhost:3000`

## How to get the Chat ID

Using your Telegram personal account:
1. Open your new bot.
2. Press Start / send `/start` to the bot.
3. Use a Telegram bot such as `@userinfobot` to view your own Telegram user/chat ID, or use your bot's `getUpdates` endpoint after sending `/start`.
4. Put that numeric ID in `.env`.

The notification is sent to the configured chat ID. The customer does not receive the Telegram notification unless you explicitly configure their chat ID.

## Notification format

The Telegram notification includes the order number, customer name, mobile number, network, promo, amount, payment method, and reference number. If a payment screenshot is uploaded, the actual image is sent to Telegram as a photo.

Payment screenshots are sent to the configured Telegram chat as actual Telegram photos and are also temporarily stored in the local `uploads/` folder.

## Hosting

This project needs a Node.js-capable host because `server.js` handles the Telegram API call. A static-only host such as GitHub Pages cannot run the server.

## Retailer portal (starter)

A new `retailer.html` page and retailer API endpoints have been added without replacing the existing customer order page. Open `/retailer.html` on the backend host (for example, `https://YOUR-RENDER-SERVICE.onrender.com/retailer.html`). The retailer login session persists in the browser until the user logs out; server-side sessions currently have a 30-day expiry.

### Required environment variable

Keep the existing Telegram variables and set a strong `ADMIN_KEY` in Render's Environment settings. Do not put this key in frontend files or commit it to GitHub.

### Create a retailer account

Use PowerShell, replacing the host, admin key, username, password, and display name with your own values:

```powershell
$body = @{ username = "retailer01"; password = "Use-A-Strong-Unique-Password-Here"; displayName = "Retailer 01"; balance = 0 } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://YOUR-RENDER-SERVICE.onrender.com/api/admin/retailers" -Headers @{ "x-admin-key" = "YOUR_ADMIN_KEY" } -ContentType "application/json" -Body $body
```

Retailer top-ups are stored as `PENDING VERIFICATION`. They do not increase the wallet until an admin approves them using `POST /api/admin/retailer-topups/:id/approve` with `x-admin-key`. Transaction files are JSON-backed (`retailers.json`, `retailer-sessions.json`, `retailer-transactions.json`) and are suitable only as a starter for testing; configure persistent storage on the hosting provider or migrate to a managed database before relying on balances for real money. Back up data before redeployments.

**Important limitations:** this initial portal provides login, persistent browser login, balance display, top-up screenshot upload, and transaction history. The existing network/promo order form has not yet been connected to automatic retailer wallet deduction, and there is no admin web screen yet for reviewing/approving top-ups. Do not use it for live retailer sales until those pieces and persistent database storage are completed and tested.
