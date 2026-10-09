const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from GitHub Pages
app.use(cors());

const UPLOAD_DIR = path.join(__dirname, "uploads");

fs.mkdirSync(UPLOAD_DIR, {
  recursive: true
});

const upload = multer({
  dest: UPLOAD_DIR,

  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png"
    ];

    const allowed =
      allowedTypes.includes(file.mimetype);

    if (!allowed) {
      return cb(
        new Error(
          "Payment screenshot must be JPG/JPEG/PNG."
        )
      );
    }

    cb(null, true);
  }
});

app.use(express.static(__dirname));

const clean = (value) =>
  decodeURIComponent(String(value ?? ""))
    .trim()
    .slice(0, 1000);

const ORDERS_FILE = path.join(__dirname, "orders-status.json");
function readOrders() {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8")); }
  catch { return {}; }
}
function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}
function manilaParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila", year: "numeric", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true
  }).formatToParts(date);
  const get = type => parts.find(p => p.type === type)?.value || "";
  return {
    date: `${get("month")} ${get("day")}, ${get("year")}`,
    time: `${get("hour")}:${get("minute")} ${get("dayPeriod")}`
  };
}
function manilaDateTime(date = new Date()) {
  const p = manilaParts(date);
  return `${p.date} ${p.time}`;
}
function adminAuthorized(req) {
  const key = process.env.ADMIN_KEY;
  if (!key) return false;
  return String(req.headers["x-admin-key"] || req.query.key || req.body?.key || "") === key;
}

// ===============================
// TELEGRAM CONFIG
// ===============================

function getTelegramConfig() {
  const token =
    process.env.TELEGRAM_BOT_TOKEN;

  const chatId =
    process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error(
      "Telegram is not configured. Check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID."
    );
  }

  return {
    token,
    chatId
  };
}

// ===============================
// ORDER MESSAGE
// ===============================

function makeMessage(body) {
  const orderType = clean(body["Order Type"] || body["OrderType"] || "");
  const network = clean(body["Network Selected"] || body["Network"] || "");
  const isMLBB = orderType.toLowerCase() === "mlbb top up" || network.toLowerCase() === "mlbb";
  const customer = clean(body["Customer Name"] || body["Customer"] || body["Name"] || "");
  const userId = clean(body["MLBB User ID"] || body["User ID"] || body["userId"] || "");
  const zoneId = clean(body["MLBB Zone ID"] || body["Zone ID"] || body["zoneId"] || "");

  return [
    "🔔 NEW RONALD E-LOADING ORDER",

    `Order No.: ${clean(
      body["Order Number"]
    )}`,

    `Customer: ${clean(body["Customer Name"] || body["Customer"] || body["Name"])}`,

    ...(body["Order Type"] === "MLBB Top Up" || body["Network"] === "MLBB" ? [] : [
      `Mobile: ${clean(body["Mobile Number"] || body["Mobile"])}`
    ]),

    `Order Type: ${((String(body["Order Type"] || "").toLowerCase().includes("mlbb") || String(body["Network"] || "").toLowerCase() === "mlbb") ? "ML" : "Loading")}`,

    `Network: ${clean(
      body["Network Selected"] ||
      body["Network"]
    )}`,

    ...(body["Order Type"] === "MLBB Top Up" || body["Network"] === "MLBB" ? [
      `User ID: ${clean(body["MLBB User ID"] || body["User ID"])}`,
      `Zone ID: ${clean(body["MLBB Zone ID"] || body["Zone ID"])}`
    ] : []),

    `Promo: ${clean(
      body["Promo Selected"] ||
      body["Promo"]
    )}`,

    `Amount: ${clean(
      body["Amount"]
    )}`,

    `Payment: ${clean(
  body["Payment Method"]
)}`,

`Time: ${new Date().toLocaleString("en-PH", {
  timeZone: "Asia/Manila",
  hour: "numeric",
  minute: "2-digit",
  hour12: true
})}`,

`Reference: ${
      clean(body["Reference Number"]) ||
      "N/A"
    }`

  ].join("\n");
}

// ===============================
// TELEGRAM REQUEST
// ===============================

async function telegramRequest(
  method,
  formData
) {
  const { token } =
    getTelegramConfig();

  const url =
    `https://api.telegram.org/bot${token}/${method}`;

  const response = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data =
    await response
      .json()
      .catch(() => ({}));

  if (
    !response.ok ||
    !data.ok
  ) {
    throw new Error(
      `Telegram API error (${response.status}): ${JSON.stringify(data)}`
    );
  }

  return data;
}

// ===============================
// SEND TELEGRAM MESSAGE
// ===============================

async function sendTelegramMessage(text, replyMarkup = null) {
  const { chatId } =
    getTelegramConfig();

  const form =
    new FormData();

  form.append(
    "chat_id",
    chatId
  );

  form.append(
    "text",
    text
  );

  form.append(
    "disable_web_page_preview",
    "true"
  );

  if (replyMarkup) {
    form.append("reply_markup", JSON.stringify(replyMarkup));
  }

  return telegramRequest(
    "sendMessage",
    form
  );
}

// ===============================
// SEND PAYMENT SCREENSHOT
// ===============================

async function sendTelegramPhoto(
  filePath,
  originalName,
  mimeType,
  caption,
  replyMarkup = null
) {
  const { chatId } =
    getTelegramConfig();

  const buffer =
    fs.readFileSync(filePath);

  const blob =
    new Blob(
      [buffer],
      { type: mimeType }
    );

  const form =
    new FormData();

  form.append(
    "chat_id",
    chatId
  );

  form.append(
    "photo",
    blob,
    originalName ||
    "payment-screenshot.jpg"
  );

  form.append(
    "caption",
    caption.slice(0, 1024)
  );

  if (replyMarkup) {
    form.append("reply_markup", JSON.stringify(replyMarkup));
  }

  return telegramRequest(
    "sendPhoto",
    form
  );
}

// ===============================
// TELEGRAM RECEIPT + COMPLETED FLOW
// ===============================

function receiptUploadKeyboard(orderNumber) {
  return {
    inline_keyboard: [[
      { text: "📎 UPLOAD RECEIPT", callback_data: `receipt_help:${orderNumber}` }
    ]]
  };
}

function completedKeyboard(orderNumber) {
  return {
    inline_keyboard: [[
      { text: "✅ COMPLETED", callback_data: `complete:${orderNumber}` }
    ]]
  };
}

function completedMessage(order) {
  const f = order.fields || {};
  const isMLBB = String(f["Order Type"] || "").toLowerCase().includes("mlbb") || String(f["Network"] || "").toLowerCase() === "mlbb";
  const successful = order.successfulTime || "";
  return [
    "🟢 ORDER COMPLETED",
    `Order No.: ${order.orderNumber}`,
    `Customer: ${clean(f["Customer Name"])}`,
    `Order Type: ${isMLBB ? "ML" : "Loading"}`,
    `Network: ${clean(f["Network Selected"] || f["Network"])}`,
    ...(isMLBB ? [`User ID: ${clean(f["MLBB User ID"])}`, `Zone ID: ${clean(f["MLBB Zone ID"])}`] : [`Mobile: ${clean(f["Mobile Number"])}`]),
    `Promo: ${clean(f["Promo Selected"] || f["Promo"])}`,
    `Amount: ${clean(f["Amount"])}`,
    `Payment: ${clean(f["Payment Method"])}`,
    `Order Time: ${order.orderTime}`,
    `Status: COMPLETED`,
    `Successful Time: ${successful}`,
    `🧾 Main receipt: attached above/below in this Telegram chat.`
  ].join("\n");
}

async function markOrderCompleted(orderNumber) {
  const orders = readOrders();
  const key = clean(orderNumber);
  const order = orders[key];
  if (!order) throw new Error("Order not found.");
  if (!order.receiptUploaded) throw new Error("Upload the MAIN RECEIPT first, then confirm the order.");
  if (order.status !== "COMPLETED") {
    order.status = "COMPLETED";
    order.successfulTime = manilaDateTime(new Date());
    writeOrders(orders);
  }
  return order;
}

function extractOrderNumberFromCaption(caption) {
  const m = String(caption || "").match(/\b(?:REL|MLT)-\d{8}-\d{4,}\b/i);
  return m ? m[0].toUpperCase() : "";
}

async function downloadTelegramFile(fileId, destination) {
  const { token } = getTelegramConfig();
  const fileForm = new FormData();
  fileForm.append("file_id", fileId);
  const result = await telegramRequest("getFile", fileForm);
  const filePath = result.result.file_path;
  const response = await fetch(`https://api.telegram.org/file/bot${token}/${filePath}`);
  if (!response.ok) throw new Error("Unable to download Telegram receipt.");
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(destination, buffer);
  return filePath;
}

async function handleTelegramReceipt(message) {
  const { chatId } = getTelegramConfig();
  if (String(message?.chat?.id) !== String(chatId)) return;
  if (!message.photo?.length) return;
  const orderNumber = extractOrderNumberFromCaption(message.caption);
  if (!orderNumber) {
    await sendTelegramMessage("📎 Receipt photo received, but I could not find the Order Number. Send it again with the caption: RECEIPT REL-YYYYMMDD-XXXX");
    return;
  }
  const orders = readOrders();
  const order = orders[orderNumber];
  if (!order) {
    await sendTelegramMessage(`❌ Order ${orderNumber} was not found.`);
    return;
  }
  const largest = message.photo[message.photo.length - 1];
  const receiptPath = path.join(UPLOAD_DIR, `receipt-${orderNumber}-${Date.now()}.jpg`);
  await downloadTelegramFile(largest.file_id, receiptPath);
  order.receiptUploaded = true;
  order.receiptUploadedTime = manilaDateTime(new Date());
  order.receiptTelegramFile = receiptPath;
  writeOrders(orders);

  await sendTelegramPhoto(
    receiptPath,
    `MAIN-RECEIPT-${orderNumber}.jpg`,
    "image/jpeg",
    `🧾 MAIN RECEIPT — ${orderNumber}\nReceipt uploaded successfully.\nReview the receipt, then click ✅ COMPLETED only after the load/top-up is actually successful.`,
    completedKeyboard(orderNumber)
  );
}

async function handleTelegramCallback(callbackQuery) {
  const data = String(callbackQuery?.data || "");
  const callbackId = callbackQuery.id;
  try {
    if (data.startsWith("receipt_help:")) {
      const orderNumber = data.slice("receipt_help:".length);
      const form = new FormData();
      form.append("callback_query_id", callbackId);
      form.append("text", "Send the MAIN RECEIPT photo here with caption: RECEIPT " + orderNumber);
      form.append("show_alert", "true");
      await telegramRequest("answerCallbackQuery", form);
      return;
    }
    if (!data.startsWith("complete:")) return;
    const orderNumber = data.slice("complete:".length);
    const order = await markOrderCompleted(orderNumber);
    const answerForm = new FormData();
    answerForm.append("callback_query_id", callbackId);
    answerForm.append("text", "Order marked COMPLETED.");
    answerForm.append("show_alert", "false");
    await telegramRequest("answerCallbackQuery", answerForm);
    await sendTelegramMessage(completedMessage(order));
  } catch (err) {
    try {
      const errorForm = new FormData();
      errorForm.append("callback_query_id", callbackId);
      errorForm.append("text", err.message || "Failed.");
      errorForm.append("show_alert", "true");
      await telegramRequest("answerCallbackQuery", errorForm);
    } catch {}
    console.error("Telegram callback failed:", err);
  }
}

let telegramOffset = 0;
let telegramPollingStarted = false;
async function startTelegramPolling() {
  if (telegramPollingStarted) return;
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) return;
  telegramPollingStarted = true;
  console.log("Telegram receipt + completed polling enabled.");
  while (true) {
    try {
      const { token } = getTelegramConfig();
      const url = `https://api.telegram.org/bot${token}/getUpdates?timeout=25&offset=${telegramOffset}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!data.ok) throw new Error(JSON.stringify(data));
      for (const update of data.result || []) {
        telegramOffset = update.update_id + 1;
        if (update.callback_query) await handleTelegramCallback(update.callback_query);
        if (update.message?.photo) await handleTelegramReceipt(update.message);
      }
    } catch (err) {
      console.error("Telegram polling error:", err.message);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

// ===============================
// ORDER API
// ===============================

app.post(
  "/api/orders",

  upload.single(
    "Payment Screenshot"
  ),

  async (req, res) => {

    try {

      const message =
        makeMessage(req.body);

      // Send order details and payment screenshot together
      if (req.file) {
        await sendTelegramPhoto(
          req.file.path,
          req.file.originalname,
          req.file.mimetype,
          message,
          receiptUploadKeyboard(clean(req.body["Order Number"]))
        );
      } else {
        await sendTelegramMessage(message, receiptUploadKeyboard(clean(req.body["Order Number"])));
      }
      // Save order + customer-facing status
      const orderNumber = clean(req.body["Order Number"]);
      const orders = readOrders();
      const now = new Date();
      const record = {
        orderNumber,
        orderTime: manilaDateTime(now),
        status: "PROCESSING",
        successfulTime: null,
        fields: req.body,
        telegramNotification: true,
        telegramScreenshot: !!req.file,
        receiptUploaded: false,
        receiptUploadedTime: null,
        receiptTelegramFile: null
      };
      orders[orderNumber] = record;
      writeOrders(orders);

      fs.appendFileSync(
        path.join(
          __dirname,
          "orders.log"
        ),
        JSON.stringify(record) + "\n"
      );

      // Send successful response
      return res.status(200).json({
        ok: true,

        orderNumber,

        telegramNotification:
          true,

        telegramScreenshot:
          !!req.file
      });

    } catch (err) {

      console.error(
        "Order submission failed:",
        err
      );

      return res.status(500).json({
        error:
          err.message ||
          "Unable to submit the order."
      });
    }
  }
);

// ===============================
// CUSTOMER ORDER STATUS
// ===============================

app.get("/api/orders/:orderNumber", (req, res) => {
  const order = readOrders()[clean(req.params.orderNumber)];
  if (!order) return res.status(404).json({ ok: false, error: "Order not found." });
  const f = order.fields || {};
  res.json({
    ok: true,
    orderNumber: order.orderNumber,
    customer: clean(f["Customer Name"]),
    orderType: (String(f["Order Type"] || "").toLowerCase().includes("mlbb") || String(f["Network"] || "").toLowerCase() === "mlbb") ? "ML" : "Loading",
    network: clean(f["Network Selected"] || f["Network"]),
    mobile: clean(f["Mobile Number"]),
    userId: clean(f["MLBB User ID"]),
    zoneId: clean(f["MLBB Zone ID"]),
    promo: clean(f["Promo Selected"] || f["Promo"]),
    amount: clean(f["Amount"]),
    payment: clean(f["Payment Method"]),
    orderTime: order.orderTime,
    status: order.status,
    successfulTime: order.successfulTime
  });
});

// ===============================
// ADMIN: MARK ORDER COMPLETED
// ===============================

app.post("/api/admin/orders/:orderNumber/complete", express.json(), async (req, res) => {
  if (!adminAuthorized(req)) return res.status(401).json({ ok: false, error: "Unauthorized." });
  try {
    const order = await markOrderCompleted(req.params.orderNumber);
    res.json({ ok: true, order });
  } catch (e) {
    res.status(404).json({ ok: false, error: e.message });
  }
});

// ===============================
// SIMPLE ADMIN PAGE
// ===============================

app.get("/admin", (req, res) => {
  if (!adminAuthorized(req)) return res.status(401).send("Unauthorized. Open /admin?key=YOUR_ADMIN_KEY");
  const orders = Object.values(readOrders()).reverse();
  const rows = orders.map(o => `<tr><td>${escapeHtml(o.orderNumber)}</td><td>${escapeHtml(o.fields?.["Customer Name"] || "")}</td><td>${escapeHtml(o.status)}</td><td>${escapeHtml(o.orderTime)}</td><td>${escapeHtml(o.successfulTime || "—")}</td><td>${o.status === "COMPLETED" ? "✅ Completed" : `<button onclick="completeOrder('${encodeURIComponent(o.orderNumber)}')">✅ COMPLETED</button>`}</td></tr>`).join("");
  res.send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ronald Admin</title><style>body{font-family:Arial,sans-serif;padding:20px;background:#f5f7fb}table{width:100%;border-collapse:collapse;background:#fff}th,td{padding:10px;border:1px solid #ddd;text-align:left}button{padding:8px 12px;border:0;border-radius:8px;cursor:pointer}h1{font-size:22px}@media(max-width:700px){table{font-size:12px}th,td{padding:6px}}</style></head><body><h1>RONALD E-LOADING — ADMIN</h1><p>Click <b>COMPLETED</b> only after the load/top-up is actually successful.</p><table><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Order Time</th><th>Successful Time</th><th>Action</th></tr></thead><tbody>${rows || '<tr><td colspan="6">No orders yet.</td></tr>'}</tbody></table><script>const KEY=${JSON.stringify(String(req.query.key||""))};async function completeOrder(no){if(!confirm('Confirm this order is successfully loaded?'))return;const r=await fetch('/api/admin/orders/'+no+'/complete?key='+encodeURIComponent(KEY),{method:'POST',headers:{'Content-Type':'application/json'}});const d=await r.json();if(!r.ok)alert(d.error||'Failed');else location.reload();}</script></body></html>`);
});
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[c]));}

// ===============================
// RETAILER PORTAL (PostgreSQL-backed)
// ===============================
const crypto = require('crypto');
const { Pool } = require('pg');
const pool = process.env.DATABASE_URL ? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
}) : null;
const topupUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req,file,cb) => {
  if (!['image/jpeg','image/png'].includes(file.mimetype)) return cb(new Error('Payment screenshot must be JPG/JPEG/PNG.'));
  cb(null,true);
}});
function hashPassword(password, salt) { return crypto.scryptSync(String(password), salt, 64).toString('hex'); }
function currentManila() { return manilaDateTime(new Date()); }
function safeCompare(a,b) { const aa=Buffer.from(String(a)); const bb=Buffer.from(String(b)); return aa.length===bb.length && crypto.timingSafeEqual(aa,bb); }
async function initRetailerDb() {
  if (!pool) { console.warn('DATABASE_URL is missing; retailer APIs will return 503 until PostgreSQL is configured.'); return; }
  await pool.query(`CREATE TABLE IF NOT EXISTS retailers (
    username TEXT PRIMARY KEY, display_name TEXT NOT NULL, salt TEXT NOT NULL, password_hash TEXT NOT NULL,
    balance NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (balance >= 0), active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS retailer_sessions (
    token_hash TEXT PRIMARY KEY, username TEXT NOT NULL REFERENCES retailers(username) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), expires_at TIMESTAMPTZ NOT NULL
  );
  CREATE INDEX IF NOT EXISTS retailer_sessions_expiry_idx ON retailer_sessions(expires_at);
  CREATE TABLE IF NOT EXISTS retailer_transactions (
    id TEXT PRIMARY KEY, username TEXT NOT NULL REFERENCES retailers(username), type TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0), payment_method TEXT, screenshot_mime TEXT, screenshot_data BYTEA,
    status TEXT NOT NULL, time_requested TIMESTAMPTZ NOT NULL DEFAULT NOW(), completed_at TIMESTAMPTZ,
    network TEXT, promo TEXT, deduction_amount NUMERIC(12,2) NOT NULL DEFAULT 0, reference_number TEXT
  );
  CREATE INDEX IF NOT EXISTS retailer_transactions_user_idx ON retailer_transactions(username, time_requested DESC);
  CREATE TABLE IF NOT EXISTS retailer_wallet_ledger (
    id BIGSERIAL PRIMARY KEY, username TEXT NOT NULL REFERENCES retailers(username), transaction_id TEXT NOT NULL UNIQUE,
    direction TEXT NOT NULL CHECK (direction IN ('CREDIT','DEBIT')), amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    balance_after NUMERIC(12,2) NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`);
}
function dbRequired(req,res,next) { if (!pool) return res.status(503).json({ok:false,error:'Retailer database is not configured. Set DATABASE_URL in Render Environment and redeploy.'}); next(); }
async function getRetailer(req) {
  const auth=String(req.headers.authorization||''); const token=auth.startsWith('Bearer ')?auth.slice(7):'';
  if (!token) return null;
  const tokenHash=crypto.createHash('sha256').update(token).digest('hex');
  const q=await pool.query(`SELECT r.username,r.display_name,r.balance,r.active FROM retailer_sessions s JOIN retailers r ON r.username=s.username WHERE s.token_hash=$1 AND s.expires_at>NOW()`,[tokenHash]);
  if (!q.rowCount) return null; const r=q.rows[0]; if (!r.active) return null;
  return {username:r.username,displayName:r.display_name,balance:Number(r.balance),tokenHash};
}
function newTopupId(){return 'RTU-'+Date.now().toString(36).toUpperCase()+'-'+crypto.randomBytes(3).toString('hex').toUpperCase();}
app.post('/api/retailer/login', dbRequired, async (req,res) => {
  try {
    const username=clean(req.body?.username).toLowerCase(); const password=String(req.body?.password||'');
    const q=await pool.query('SELECT username,display_name,salt,password_hash,active,balance FROM retailers WHERE username=$1',[username]); const user=q.rows[0];
    if (!user || !user.active || !safeCompare(hashPassword(password,user.salt),user.password_hash)) return res.status(401).json({ok:false,error:'Invalid username or password.'});
    const token=crypto.randomBytes(32).toString('hex'); const tokenHash=crypto.createHash('sha256').update(token).digest('hex');
    await pool.query('INSERT INTO retailer_sessions(token_hash,username,expires_at) VALUES($1,$2,NOW()+INTERVAL \'30 days\')',[tokenHash,username]);
    res.json({ok:true,token,username,displayName:user.display_name,balance:Number(user.balance)});
  } catch(e){ console.error('retailer login error',e); res.status(500).json({ok:false,error:'Login failed due to a server error.'}); }
});
app.post('/api/retailer/logout', dbRequired, async (req,res) => { try {const a=String(req.headers.authorization||'');const token=a.startsWith('Bearer ')?a.slice(7):'';if(token)await pool.query('DELETE FROM retailer_sessions WHERE token_hash=$1',[crypto.createHash('sha256').update(token).digest('hex')]);res.json({ok:true});}catch(e){res.status(500).json({ok:false,error:'Logout failed.'});} });
app.post('/api/admin/retailers', dbRequired, async (req,res) => {
  if (!adminAuthorized(req)) return res.status(401).json({ok:false,error:'Unauthorized.'});
  const username=clean(req.body?.username).toLowerCase();const password=String(req.body?.password||'');const displayName=clean(req.body?.displayName||username);const balance=Number(req.body?.balance||0);
  if(!/^[a-z0-9._-]{4,32}$/.test(username))return res.status(400).json({ok:false,error:'Username must be 4–32 characters (letters, numbers, dot, underscore, hyphen).'});
  if(password.length<10||password.length>128)return res.status(400).json({ok:false,error:'Password must be 10–128 characters.'});
  if(!Number.isFinite(balance)||balance<0||balance>10000000)return res.status(400).json({ok:false,error:'Starting balance is invalid.'});
  const salt=crypto.randomBytes(16).toString('hex');const passwordHash=hashPassword(password,salt);
  try{await pool.query('INSERT INTO retailers(username,display_name,salt,password_hash,balance) VALUES($1,$2,$3,$4,$5)',[username,displayName,salt,passwordHash,balance]);res.status(201).json({ok:true,username});}
  catch(e){if(e.code==='23505')return res.status(409).json({ok:false,error:'Username already exists.'});console.error('create retailer error',e);res.status(500).json({ok:false,error:'Could not create retailer account.'});}
});
app.get('/api/retailer/me', dbRequired, async (req,res) => {try{const r=await getRetailer(req);if(!r)return res.status(401).json({ok:false,error:'Please log in.'});res.json({ok:true,username:r.username,displayName:r.displayName,balance:r.balance});}catch(e){res.status(500).json({ok:false,error:'Could not load account.'});}});
app.get('/api/retailer/transactions', dbRequired, async (req,res) => {try{const r=await getRetailer(req);if(!r)return res.status(401).json({ok:false,error:'Please log in.'});const q=await pool.query(`SELECT id,username,type,amount,payment_method AS "paymentMethod",status,TO_CHAR(time_requested AT TIME ZONE 'Asia/Manila','Mon DD, YYYY HH12:MI AM') AS "timeRequested",TO_CHAR(completed_at AT TIME ZONE 'Asia/Manila','Mon DD, YYYY HH12:MI AM') AS "timeSuccessfullyOrdered",COALESCE(network,'—') AS network,COALESCE(promo,'—') AS promo,deduction_amount AS "deductionAmount",reference_number AS "referenceNumber" FROM retailer_transactions WHERE username=$1 ORDER BY time_requested DESC LIMIT 300`,[r.username]);res.json({ok:true,transactions:q.rows.map(t=>({...t,amount:Number(t.amount),deductionAmount:Number(t.deductionAmount)}))});}catch(e){console.error('transactions error',e);res.status(500).json({ok:false,error:'Could not load transactions.'});}});
app.post('/api/retailer/topups', dbRequired, topupUpload.single('screenshot'), async (req,res) => {
  let client;try{const r=await getRetailer(req);if(!r)return res.status(401).json({ok:false,error:'Please log in.'});const amount=Number(req.body.amount);const payment=clean(req.body.paymentMethod);
    if(!Number.isFinite(amount)||Math.round(amount*100)!==amount*100||amount<1||amount>100000)return res.status(400).json({ok:false,error:'Enter a valid top-up amount (₱1–₱100,000, up to 2 decimal places).'});
    if(!['GCash','Maya','GoTyme Bank','MariBank'].includes(payment))return res.status(400).json({ok:false,error:'Choose a valid payment method.'});if(!req.file)return res.status(400).json({ok:false,error:'Attach your payment screenshot.'});
    const id=newTopupId();client=await pool.connect();await client.query('BEGIN');await client.query(`INSERT INTO retailer_transactions(id,username,type,amount,payment_method,screenshot_mime,screenshot_data,status,network,promo,deduction_amount,reference_number) VALUES($1,$2,'TOP UP BALANCE',$3,$4,$5,$6,'PENDING VERIFICATION','—','—',0,$1)`,[id,r.username,amount,payment,req.file.mimetype,req.file.buffer]);await client.query('COMMIT');res.status(201).json({ok:true,transaction:{id,username:r.username,type:'TOP UP BALANCE',amount,paymentMethod:payment,status:'PENDING VERIFICATION',timeRequested:currentManila(),network:'—',promo:'—',deductionAmount:0,referenceNumber:id},message:'Top-up submitted. Balance is credited only after admin approval.'});
  }catch(e){if(client)await client.query('ROLLBACK').catch(()=>{});console.error('topup submission error',e);res.status(500).json({ok:false,error:'Could not submit top-up request.'});}finally{if(client)client.release();}
});
// Admin review endpoints: require ADMIN_KEY. Screenshot bytes are served only after admin authentication.
app.get('/api/admin/retailer-topups', dbRequired, async (req,res)=>{if(!adminAuthorized(req))return res.status(401).json({ok:false,error:'Unauthorized.'});try{const q=await pool.query(`SELECT id,username,amount,payment_method AS "paymentMethod",status,reference_number AS "referenceNumber",TO_CHAR(time_requested AT TIME ZONE 'Asia/Manila','Mon DD, YYYY HH12:MI AM') AS "timeRequested",('/api/admin/retailer-topups/'+id+'/screenshot') AS "screenshotUrl" FROM retailer_transactions WHERE type='TOP UP BALANCE' ORDER BY time_requested DESC LIMIT 300`);res.json({ok:true,transactions:q.rows.map(t=>({...t,amount:Number(t.amount)}))});}catch(e){res.status(500).json({ok:false,error:'Could not load top-up requests.'});}});
app.get('/api/admin/retailer-topups/:id/screenshot', dbRequired, async (req,res)=>{if(!adminAuthorized(req))return res.status(401).send('Unauthorized');try{const q=await pool.query("SELECT screenshot_mime,screenshot_data FROM retailer_transactions WHERE id=$1 AND type='TOP UP BALANCE'",[req.params.id]);if(!q.rowCount||!q.rows[0].screenshot_data)return res.status(404).send('Screenshot not found');res.set('Content-Type',q.rows[0].screenshot_mime||'application/octet-stream');res.set('Cache-Control','no-store');res.send(q.rows[0].screenshot_data);}catch(e){res.status(500).send('Could not load screenshot');}});
app.post('/api/admin/retailer-topups/:id/approve', dbRequired, async (req,res) => {
  if(!adminAuthorized(req))return res.status(401).json({ok:false,error:'Unauthorized.'});const client=await pool.connect();try{await client.query('BEGIN');const q=await client.query("SELECT id,username,amount,status FROM retailer_transactions WHERE id=$1 AND type='TOP UP BALANCE' FOR UPDATE",[req.params.id]);if(!q.rowCount){await client.query('ROLLBACK');return res.status(404).json({ok:false,error:'Top-up request not found.'});}const tx=q.rows[0];if(tx.status==='APPROVED'){await client.query('COMMIT');return res.json({ok:true,alreadyApproved:true,transaction:{id:tx.id,status:tx.status}});}if(tx.status!=='PENDING VERIFICATION'){await client.query('ROLLBACK');return res.status(409).json({ok:false,error:'This request is not pending approval.'});}
    const uq=await client.query('UPDATE retailers SET balance=balance+$1 WHERE username=$2 AND active=TRUE RETURNING balance',[tx.amount,tx.username]);if(!uq.rowCount){await client.query('ROLLBACK');return res.status(404).json({ok:false,error:'Retailer not found or inactive.'});}
    await client.query("UPDATE retailer_transactions SET status='APPROVED',completed_at=NOW() WHERE id=$1",[tx.id]);await client.query("INSERT INTO retailer_wallet_ledger(username,transaction_id,direction,amount,balance_after) VALUES($1,$2,'CREDIT',$3,$4)",[tx.username,tx.id,tx.amount,uq.rows[0].balance]);await client.query('COMMIT');res.json({ok:true,transaction:{id:tx.id,status:'APPROVED'},balance:Number(uq.rows[0].balance)});
  }catch(e){await client.query('ROLLBACK').catch(()=>{});console.error('topup approval error',e);res.status(500).json({ok:false,error:'Could not approve top-up.'});}finally{client.release();}
});
app.post('/api/admin/retailer-topups/:id/reject', dbRequired, async (req,res)=>{if(!adminAuthorized(req))return res.status(401).json({ok:false,error:'Unauthorized.'});try{const q=await pool.query("UPDATE retailer_transactions SET status='REJECTED' WHERE id=$1 AND type='TOP UP BALANCE' AND status='PENDING VERIFICATION' RETURNING id,status",[req.params.id]);if(!q.rowCount)return res.status(409).json({ok:false,error:'Request not found or no longer pending.'});res.json({ok:true,transaction:q.rows[0]});}catch(e){res.status(500).json({ok:false,error:'Could not reject top-up.'});}});

app.get('/retailer-admin', (req,res) => {
  res.type('html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retailer Top-up Admin</title><style>body{font-family:Arial,sans-serif;background:#f3f6f9;color:#1c2938;margin:0;padding:18px}main{max-width:950px;margin:auto}.card{background:white;border-radius:14px;padding:16px;margin:12px 0;box-shadow:0 4px 16px #0001}input,button{padding:11px;border-radius:9px;border:1px solid #ccd6e0;font:inherit}button{cursor:pointer;font-weight:bold}.approve{background:#0875d1;color:white;border:0}.reject{background:#fff0f0;color:#9e2424;border:0}.tx{border-top:1px solid #e5eaf0;padding:14px 0}.tx img{max-width:260px;max-height:300px;display:block;margin:10px 0}.muted{color:#637184;font-size:13px}#key{width:min(500px,90%)}.status{font-weight:bold}</style></head><body><main><h1>RONALD E-LOADING — TOP-UP REVIEW</h1><p>Payment screenshots and wallet credits are controlled by this admin key. Keep it private.</p><div class="card"><label>Admin Key<br><input id="key" type="password" autocomplete="off" placeholder="Enter Render ADMIN_KEY"></label> <button class="approve" onclick="loadTx()">LOAD REQUESTS</button><p id="msg" class="muted"></p></div><div class="card"><div id="list">Enter your admin key to view pending and previous requests.</div></div></main><script>let key='';const el=id=>document.getElementById(id);async function api(url,opts={}){let r=await fetch(url,{...opts,headers:{...(opts.headers||{}),'x-admin-key':key}});if(!r.ok){let d={};try{d=await r.json()}catch{}throw Error(d.error||'Request failed: '+r.status)}return r.json()}async function loadTx(){key=el('key').value;el('msg').textContent='Loading…';try{const d=await api('/api/admin/retailer-topups');el('msg').textContent='Loaded '+d.transactions.length+' top-up request(s).';el('list').innerHTML=d.transactions.length?d.transactions.map(t=>'<div class="tx"><h3>'+esc(t.id)+' · ₱'+Number(t.amount).toFixed(2)+'</h3><p>Retailer: <b>'+esc(t.username)+'</b> · Method: '+esc(t.paymentMethod||'—')+' · Status: <span class="status">'+esc(t.status)+'</span></p><p class="muted">Requested: '+esc(t.timeRequested||'—')+' · Reference: '+esc(t.referenceNumber||t.id)+'</p><div id="img-'+esc(t.id)+'" class="muted">Loading screenshot…</div>'+(t.status==='PENDING VERIFICATION'?'<button class="approve" onclick="act(\''+esc(t.id)+'\',\'approve\')">APPROVE & CREDIT WALLET</button> <button class="reject" onclick="act(\''+esc(t.id)+'\',\'reject\')">REJECT</button>':'')+'</div>').join(''):'No top-up requests.';for(const t of d.transactions){try{const r=await fetch('/api/admin/retailer-topups/'+encodeURIComponent(t.id)+'/screenshot',{headers:{'x-admin-key':key}});if(r.ok){const blob=await r.blob();const img=document.createElement('img');img.alt='Payment screenshot for '+t.id;img.src=URL.createObjectURL(blob);el('img-'+t.id).replaceChildren(img)}else el('img-'+t.id).textContent='Screenshot unavailable'}catch{el('img-'+t.id).textContent='Could not load screenshot'}}}catch(e){el('msg').textContent=e.message;el('list').textContent='Unable to load requests.'}}async function act(id,action){if(action==='approve'&&!confirm('Verify that the payment was actually received before crediting the wallet. Approve '+id+'?'))return;if(action==='reject'&&!confirm('Reject top-up '+id+'?'))return;try{await api('/api/admin/retailer-topups/'+encodeURIComponent(id)+'/'+action,{method:'POST'});await loadTx()}catch(e){alert(e.message)}}function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</script></body></html>`);
});

// ===============================
// HEALTH CHECK
// ===============================

app.get(
  "/api/health",
  (req, res) => {

    res.json({
      ok: true,

      telegramConfigured:
        Boolean(
          process.env.TELEGRAM_BOT_TOKEN &&
          process.env.TELEGRAM_CHAT_ID
        ),
      retailerDatabaseConfigured: Boolean(process.env.DATABASE_URL)
    });

  }
);

// ===============================
// START SERVER
// ===============================

initRetailerDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Ronald E-Loading server running on port ${PORT}`);
    startTelegramPolling();
  });
}).catch(err => {
  console.error('Failed to initialize retailer PostgreSQL tables:', err);
  process.exit(1);
});




