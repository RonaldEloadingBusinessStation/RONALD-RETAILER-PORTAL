# Retailer portal update notes

- New retailer accounts are created with a ₱0.00 balance. Do not use a manual starting balance.
- Retailer top-up requests attach the screenshot and send a Telegram notification with an approval button. The wallet is credited only when the admin approves.
- Retailer load requests use `/api/retailer/orders`; wallet deduction is performed only by the explicit admin approval endpoint/button, not at request time.
- The retailer page uses the current origin as its backend by default, fixing the previous unrelated API hostname.
- Network tiles have restored blue styling.

## Important limits

The portal's retailer data is currently stored in JSON files (`retailers.json`, `retailer-sessions.json`, and `retailer-transactions.json`) on the server filesystem. Render filesystems may be ephemeral unless a persistent disk is configured; this is not yet a production-safe ledger. The retailer UI still needs a promo selector wired to the full catalogue and a complete admin review dashboard before real-money use. Test with dummy accounts only.

Telegram uses the configured `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Check Render logs if a request reports notification failure. Do not commit `.env` or secrets.
