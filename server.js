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
    if (data.startsWith("retailer_topup_approve:")) {
      const id = data.slice("retailer_topup_approve:".length);
      const txs = readJsonFile(RETAILER_TX_FILE, []); const tx = txs.find(t => t.id === id);
      if (!tx) throw new Error("Top-up request not found.");
      if (tx.status === "COMPLETED") throw new Error("This top-up has already been approved.");
      const users = readJsonFile(RETAILERS_FILE, {}); const user = users[tx.username];
      if (!user) throw new Error("Retailer account not found.");
      user.balance = Number(user.balance || 0) + Number(tx.amount || 0);
      tx.status = "COMPLETED"; tx.timeSuccessfullyOrdered = currentManila();
      writeJsonFile(RETAILERS_FILE, users); writeJsonFile(RETAILER_TX_FILE, txs);
      const answer = new FormData(); answer.append("callback_query_id", callbackId); answer.append("text", "Top-up approved and wallet credited.");
      await telegramRequest("answerCallbackQuery", answer);
      await sendTelegramMessage(`✅ RETAILER TOP-UP APPROVED\nRequest: ${tx.id}\nRetailer: ${tx.username}\nCredited: ₱${Number(tx.amount).toFixed(2)}\nNew balance: ₱${Number(user.balance).toFixed(2)}\nTime: ${tx.timeSuccessfullyOrdered}`);
      return;
    }
    if (data.startsWith("retailer_load_approve:")) {
      const id = data.slice("retailer_load_approve:".length);
      const txs = readJsonFile(RETAILER_TX_FILE, []); const tx = txs.find(t => t.id === id);
      if (!tx) throw new Error("Retailer load request not found.");
      if (tx.status === "COMPLETED") throw new Error("This order has already been approved.");
      const users = readJsonFile(RETAILERS_FILE, {}); const user = users[tx.username];
      if (!user) throw new Error("Retailer account not found.");
      const amount = Number(tx.amount || 0); if (Number(user.balance || 0) < amount) throw new Error("Insufficient wallet balance.");
      user.balance = Number(user.balance || 0) - amount; tx.status = "COMPLETED"; tx.deductionAmount = amount; tx.timeSuccessfullyOrdered = currentManila();
      writeJsonFile(RETAILERS_FILE, users); writeJsonFile(RETAILER_TX_FILE, txs);
      const answer = new FormData(); answer.append("callback_query_id", callbackId); answer.append("text", "Load approved and wallet deducted.");
      await telegramRequest("answerCallbackQuery", answer);
      await sendTelegramMessage(`✅ RETAILER LOAD APPROVED\nOrder: ${tx.id}\nRetailer: ${tx.username}\nNetwork: ${tx.network}\nPromo: ${tx.promo}\nDeducted: ₱${amount.toFixed(2)}\nNew balance: ₱${Number(user.balance).toFixed(2)}\nTime: ${tx.timeSuccessfullyOrdered}`);
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
// RETAILER PORTAL (JSON-backed starter implementation)
// ===============================
const crypto = require('crypto');
const RETAILERS_FILE = path.join(__dirname, 'retailers.json');
const RETAILER_SESSIONS_FILE = path.join(__dirname, 'retailer-sessions.json');
const RETAILER_TX_FILE = path.join(__dirname, 'retailer-transactions.json');
function readJsonFile(file, fallback) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } }
function writeJsonFile(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
function hashPassword(password, salt) { return crypto.scryptSync(String(password), salt, 64).toString('hex'); }
function currentManila() { return manilaDateTime(new Date()); }
function getRetailer(req) {
  const auth = String(req.headers.authorization || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const sessions = readJsonFile(RETAILER_SESSIONS_FILE, {});
  const session = sessions[token];
  if (!session) return null;
  if (session.expiresAt && Date.now() > session.expiresAt) { delete sessions[token]; writeJsonFile(RETAILER_SESSIONS_FILE, sessions); return null; }
  const users = readJsonFile(RETAILERS_FILE, {});
  const user = users[session.username];
  return user && user.active ? { username: session.username, user, token } : null;
}
app.use(express.json({ limit: '1mb' }));
app.post('/api/retailer/login', (req, res) => {
  const username = clean(req.body?.username).toLowerCase(); const password = String(req.body?.password || '');
  const users = readJsonFile(RETAILERS_FILE, {}); const user = users[username];
  if (!user || !user.active || !user.salt || hashPassword(password, user.salt) !== user.passwordHash) return res.status(401).json({ok:false,error:'Invalid username or password.'});
  const token = crypto.randomBytes(32).toString('hex'); const sessions = readJsonFile(RETAILER_SESSIONS_FILE, {});
  sessions[token] = { username, createdAt: Date.now(), expiresAt: Date.now() + 30*24*60*60*1000 }; writeJsonFile(RETAILER_SESSIONS_FILE, sessions);
  return res.json({ok:true,token,username,displayName:user.displayName||username,balance:Number(user.balance||0)});
});
app.post('/api/retailer/logout', (req,res) => { const auth=String(req.headers.authorization||''); const token=auth.startsWith('Bearer ')?auth.slice(7):''; const sessions=readJsonFile(RETAILER_SESSIONS_FILE,{}); delete sessions[token]; writeJsonFile(RETAILER_SESSIONS_FILE,sessions); res.json({ok:true}); });
// Admin-only account creation: POST JSON {username,password,displayName,balance} with x-admin-key header.
app.post('/api/admin/retailers', (req,res) => {
  if (!adminAuthorized(req)) return res.status(401).json({ok:false,error:'Unauthorized.'});
  const username=clean(req.body?.username).toLowerCase(); const password=String(req.body?.password||''); const displayName=clean(req.body?.displayName||username);
  if (!/^[a-z0-9._-]{4,32}$/.test(username)) return res.status(400).json({ok:false,error:'Username must be 4–32 characters (letters, numbers, dot, underscore, hyphen).'});
  if (password.length < 10) return res.status(400).json({ok:false,error:'Password must be at least 10 characters.'});
  const users=readJsonFile(RETAILERS_FILE,{}); if(users[username]) return res.status(409).json({ok:false,error:'Username already exists.'});
  const salt=crypto.randomBytes(16).toString('hex'); users[username]={username,displayName,salt,passwordHash:hashPassword(password,salt),balance:0,active:true,createdAt:currentManila()}; writeJsonFile(RETAILERS_FILE,users); res.status(201).json({ok:true,username});
});
app.get('/api/retailer/me', (req,res) => { const r=getRetailer(req); if(!r)return res.status(401).json({ok:false,error:'Please log in.'}); res.json({ok:true,username:r.username,displayName:r.user.displayName||r.username,balance:Number(r.user.balance||0)}); });
app.get('/api/retailer/transactions', (req,res) => { const r=getRetailer(req); if(!r)return res.status(401).json({ok:false,error:'Please log in.'}); const all=readJsonFile(RETAILER_TX_FILE,[]); res.json({ok:true,transactions:all.filter(t=>t.username===r.username).reverse()}); });
app.post('/api/retailer/topups', upload.single('screenshot'), async (req,res) => {
  const r=getRetailer(req); if(!r)return res.status(401).json({ok:false,error:'Please log in.'});
  const amount=Number(req.body.amount); const payment=clean(req.body.paymentMethod);
  if(!Number.isFinite(amount)||amount<1||amount>100000) return res.status(400).json({ok:false,error:'Enter a valid top-up amount.'});
  if(!['GCash','Maya','GoTyme Bank','MariBank'].includes(payment)) return res.status(400).json({ok:false,error:'Choose a valid payment method.'});
  if(!req.file) return res.status(400).json({ok:false,error:'Attach your payment screenshot.'});
  const txs=readJsonFile(RETAILER_TX_FILE,[]); const id='RTU-'+Date.now().toString(36).toUpperCase()+'-'+crypto.randomBytes(2).toString('hex').toUpperCase();
  const tx={id,username:r.username,type:'TOP UP BALANCE',amount,paymentMethod:payment,screenshot:req.file.filename,status:'PENDING VERIFICATION',timeRequested:currentManila(),timeSuccessfullyOrdered:null,network:'—',promo:'—',deductionAmount:0}; txs.push(tx); writeJsonFile(RETAILER_TX_FILE,txs);
  try {
    const caption=`💳 RETAILER WALLET TOP-UP REQUEST\nRequest: ${id}\nRetailer: ${r.user.displayName||r.username} (@${r.username})\nAmount: ₱${amount.toFixed(2)}\nPayment: ${payment}\nStatus: PENDING VERIFICATION\nRequested: ${tx.timeRequested}\n\nApprove only after verifying the payment.`;
    await sendTelegramPhoto(path.join(UPLOAD_DIR, req.file.filename), req.file.originalname, req.file.mimetype, caption, {inline_keyboard:[[{text:'✅ APPROVE TOP-UP',callback_data:`retailer_topup_approve:${id}`}]]});
  } catch (err) {
    console.error('Retailer top-up Telegram notification failed:', err.message);
    tx.telegramNotification=false; writeJsonFile(RETAILER_TX_FILE,txs);
    return res.status(502).json({ok:false,error:'Request saved but Telegram notification failed. Check Render logs and bot configuration before resubmitting.',transactionId:id});
  }
  tx.telegramNotification=true; writeJsonFile(RETAILER_TX_FILE,txs);
  res.status(201).json({ok:true,transaction:tx,message:'Top-up request sent to admin for verification. Wallet updates only after approval.'});
});
app.post('/api/admin/retailer-topups/:id/approve', (req,res) => {
  if (!adminAuthorized(req)) return res.status(401).json({ok:false,error:'Unauthorized.'});
  const txs=readJsonFile(RETAILER_TX_FILE,[]); const tx=txs.find(t=>t.id===req.params.id); if(!tx)return res.status(404).json({ok:false,error:'Transaction not found.'}); if(tx.status==='COMPLETED')return res.json({ok:true,transaction:tx});
  const users=readJsonFile(RETAILERS_FILE,{}); const u=users[tx.username]; if(!u)return res.status(404).json({ok:false,error:'Retailer not found.'}); u.balance=Number(u.balance||0)+Number(tx.amount); tx.status='COMPLETED'; tx.timeSuccessfullyOrdered=currentManila(); writeJsonFile(RETAILERS_FILE,users); writeJsonFile(RETAILER_TX_FILE,txs); res.json({ok:true,transaction:tx,balance:u.balance});
});


// Retailer load requests: reserve/deduct wallet only after admin approval.
app.post('/api/retailer/orders', express.json(), async (req,res) => {
  const r=getRetailer(req); if(!r) return res.status(401).json({ok:false,error:'Please log in.'});
  const network=clean(req.body?.network), promo=clean(req.body?.promo), amount=Number(req.body?.amount), mobile=clean(req.body?.mobile);
  if(!['SMART','TNT','DITO','GLOBE','TM','GOMO','GLOBE AT HOME','GFIBER'].includes(network)) return res.status(400).json({ok:false,error:'Choose a supported network.'});
  if(!promo || !Number.isFinite(amount) || amount<=0 || amount>100000 || !mobile) return res.status(400).json({ok:false,error:'Enter mobile/account number, promo, and valid amount.'});
  if(Number(r.user.balance||0)<amount) return res.status(400).json({ok:false,error:'Insufficient wallet balance.'});
  const txs=readJsonFile(RETAILER_TX_FILE,[]); const id='RLD-'+Date.now().toString(36).toUpperCase()+'-'+crypto.randomBytes(2).toString('hex').toUpperCase();
  const tx={id,username:r.username,type:'RETAILER LOAD',network,promo,mobile,amount,status:'PENDING ADMIN APPROVAL',timeRequested:currentManila(),timeSuccessfullyOrdered:null,deductionAmount:0}; txs.push(tx); writeJsonFile(RETAILER_TX_FILE,txs);
  try { await sendTelegramMessage(`📲 RETAILER LOAD REQUEST\nOrder: ${id}\nRetailer: ${r.user.displayName||r.username} (@${r.username})\nNetwork: ${network}\nPromo: ${promo}\nMobile/Account: ${mobile}\nAmount: ₱${amount.toFixed(2)}\nWallet before approval: ₱${Number(r.user.balance).toFixed(2)}\nStatus: PENDING ADMIN APPROVAL\n\nOnly approve after the load is actually completed.`,{inline_keyboard:[[{text:'✅ APPROVE & DEDUCT WALLET',callback_data:`retailer_load_approve:${id}`}]]}); }
  catch(err){console.error('Retailer load Telegram notification failed:',err.message); return res.status(502).json({ok:false,error:'Order saved but Telegram notification failed. Check Render logs.',transactionId:id});}
  res.status(201).json({ok:true,transaction:tx});
});
app.post('/api/admin/retailer-orders/:id/approve', (req,res) => {
  if(!adminAuthorized(req)) return res.status(401).json({ok:false,error:'Unauthorized.'});
  const txs=readJsonFile(RETAILER_TX_FILE,[]), tx=txs.find(t=>t.id===req.params.id); if(!tx)return res.status(404).json({ok:false,error:'Transaction not found.'});
  if(tx.status==='COMPLETED')return res.status(409).json({ok:false,error:'Order already approved.'});
  const users=readJsonFile(RETAILERS_FILE,{}), user=users[tx.username]; if(!user)return res.status(404).json({ok:false,error:'Retailer not found.'});
  const amount=Number(tx.amount||0); if(Number(user.balance||0)<amount)return res.status(400).json({ok:false,error:'Insufficient wallet balance.'});
  user.balance=Number(user.balance||0)-amount; tx.status='COMPLETED'; tx.deductionAmount=amount; tx.timeSuccessfullyOrdered=currentManila(); writeJsonFile(RETAILERS_FILE,users); writeJsonFile(RETAILER_TX_FILE,txs); res.json({ok:true,transaction:tx,balance:user.balance});
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
        )
    });

  }
);

// ===============================
// START SERVER
// ===============================

app.listen(
  PORT,
  () => {
    console.log(
      `Ronald E-Loading server running on port ${PORT}`
    );
    startTelegramPolling();
  }
);




