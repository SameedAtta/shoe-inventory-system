// utils/backupHelper.js
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const mongoose = require("mongoose");
require("dotenv").config();

// Paths (project root)
const ROOT = path.join(__dirname, "..");
const TOKEN_PATH = path.join(ROOT, "token.json");         // token.json in project root
const CREDENTIALS_PATH = path.join(ROOT, "credentials.json"); // credentials.json in project root
const BACKUP_PATH = path.join(ROOT, "backup.json");       // temporary generated backup

async function authorize() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(`Missing credentials.json at ${CREDENTIALS_PATH}`);
  }
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error(`Missing token.json at ${TOKEN_PATH}`);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));

  // credentials may have installed or web - handle both
  const client = credentials.installed || credentials.web;
  if (!client) throw new Error("Invalid credentials.json format");

  const { client_id, client_secret, redirect_uris } = client;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

async function ensureMongooseConnected() {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return;
  }
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not found in env");
  await mongoose.connect(uri, {
    // driver options - current driver ignores these flags but harmless
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function createDatabaseBackup() {
  // ensure connected
  await ensureMongooseConnected();

  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection not available");

  const collections = await db.collections();
  const backup = {};

  for (const collection of collections) {
    const name = collection.collectionName;
    const docs = await collection.find({}).toArray();
    backup[name] = docs;
  }

  fs.writeFileSync(BACKUP_PATH, JSON.stringify(backup, null, 2), "utf8");
  return BACKUP_PATH;
}

async function uploadToDrive(auth, filePath) {
  const drive = google.drive({ version: "v3", auth });

  const fileMetadata = {
    name: `shoe_store_backup_${new Date().toISOString().split("T")[0]}.json`,
  };
  const media = {
    mimeType: "application/json",
    body: fs.createReadStream(filePath),
  };

  const res = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id, name, webViewLink",
  });

  return res.data; // contains id, name, webViewLink
}

/**
 * Main helper that the route calls.
 * Returns: { success: boolean, link?, error? }
 */
async function backupToDrive() {
  try {
    // authorize google
    const auth = await authorize();

    // create backup JSON
    const backupPath = await createDatabaseBackup();

    // upload
    const result = await uploadToDrive(auth, backupPath);

    // optional: remove local backup file (keep or remove as you prefer)
    try { fs.unlinkSync(backupPath); } catch (e) { /* ignore */ }

    return { success: true, link: result.webViewLink || null, name: result.name || null };
  } catch (err) {
    return { success: false, error: err.message || String(err) };
  }
}

module.exports = { backupToDrive };




// // utils/backupHelper.js
// const fs = require("fs");
// const path = require("path");
// const { google } = require("googleapis");
// const mongoose = require("mongoose");

// const TOKEN_PATH = path.join(__dirname, "../scripts/token.json");
// const CREDENTIALS_PATH = path.join(__dirname, "../credentials.json");

// async function authorize() {
//   const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
//   const token = JSON.parse(fs.readFileSync(TOKEN_PATH));

//   const { client_secret, client_id, redirect_uris } = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
//   oAuth2Client.setCredentials(token);

//   return oAuth2Client;
// }

// async function createDatabaseBackup() {
//   const db = mongoose.connection.db;
//   const collections = await db.collections();

//   const backup = {};
//   for (const collection of collections) {
//     const name = collection.collectionName;
//     const docs = await collection.find({}).toArray();
//     backup[name] = docs;
//   }

//   const backupPath = path.join(__dirname, "../scripts/backup.json");
//   fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
//   return backupPath;
// }

// async function uploadToDrive(auth, filePath) {
//   const drive = google.drive({ version: "v3", auth });
//   const fileMetadata = {
//     name: `shoe_store_backup_${new Date().toISOString().split("T")[0]}.json`,
//   };
//   const media = {
//     mimeType: "application/json",
//     body: fs.createReadStream(filePath),
//   };
//   const res = await drive.files.create({
//     resource: fileMetadata,
//     media,
//     fields: "id, name, webViewLink",
//   });
//   return res.data.webViewLink;
// }

// async function backupToDrive() {
//   try {
//     const auth = await authorize();
//     const backupPath = await createDatabaseBackup();
//     const link = await uploadToDrive(auth, backupPath);
//     return { success: true, link };
//   } catch (err) {
//     console.error("❌ Backup failed:", err);
//     return { success: false, error: err.message };
//   }
// }

// module.exports = { backupToDrive };
