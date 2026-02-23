// scripts/backupToDrive.js
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// ===== Connect to MongoDB =====
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

// ===== Google Drive Setup =====
const TOKEN_PATH = path.join(__dirname, "../token.json");
const CREDENTIALS_PATH = path.join(__dirname, "../credentials.json");

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}

// ===== Create Database Dump =====
async function createDatabaseBackup() {
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection not ready!");

  const collections = await db.collections();
  const backup = {};

  for (const collection of collections) {
    const name = collection.collectionName;
    const docs = await collection.find({}).toArray();
    backup[name] = docs;
  }

  const backupPath = path.join(__dirname, "backup.json");
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  return backupPath;
}

// ===== Upload to Google Drive =====
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

  console.log(`✅ Backup uploaded: ${res.data.name}`);
  console.log(`🔗 View it here: ${res.data.webViewLink}`);
}

// ===== Run Backup =====
(async function () {
  try {
    await connectDB(); // wait for connection first
    const auth = await authorize();
    const backupPath = await createDatabaseBackup();
    await uploadToDrive(auth, backupPath);
    console.log("✅ Backup process completed successfully!");
  } catch (err) {
    console.error("❌ Error during backup:", err);
  } finally {
    mongoose.connection.close();
  }
})();
