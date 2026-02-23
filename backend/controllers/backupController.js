const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");
const { google } = require("googleapis");
const Product = require("../models/product");
const Company = require("../models/company");
const User = require("../models/user");
const Sale = require("../models/sale"); // if you have it

// Load credentials from file
const CREDENTIALS_PATH = path.join(__dirname, "../credentials.json");
const TOKEN_PATH = path.join(__dirname, "../token.json"); // will be created after first login

async function authorize() {
  const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, "utf8"));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (await fs.pathExists(TOKEN_PATH)) {
    const token = JSON.parse(await fs.readFile(TOKEN_PATH, "utf8"));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  } else {
    throw new Error("Google Drive not authorized yet. Please run initial auth setup.");
  }
}

exports.backupDatabase = async (req, res) => {
  try {
    const backupDir = path.join(__dirname, "../backups");
    await fs.ensureDir(backupDir);

    // Get data from MongoDB
    const [products, companies, users, sales] = await Promise.all([
      Product.find().lean(),
      Company.find().lean(),
      User.find().lean(),
      Sale.find().lean(),
    ]);

    // Write each collection to JSON
    await fs.writeJson(path.join(backupDir, "products.json"), products, { spaces: 2 });
    await fs.writeJson(path.join(backupDir, "companies.json"), companies, { spaces: 2 });
    await fs.writeJson(path.join(backupDir, "users.json"), users, { spaces: 2 });
    await fs.writeJson(path.join(backupDir, "sales.json"), sales, { spaces: 2 });

    // Zip all files
    const zipPath = path.join(backupDir, `backup-${Date.now()}.zip`);
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", resolve);
      archive.on("error", reject);

      archive.pipe(output);
      archive.directory(backupDir, false);
      archive.finalize();
    });

    // Upload to Google Drive
    const auth = await authorize();
    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: `ShoeStoreBackup-${new Date().toISOString().split("T")[0]}.zip`,
    };
    const media = {
      mimeType: "application/zip",
      body: fs.createReadStream(zipPath),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, name, webViewLink",
    });

    res.status(200).json({
      success: true,
      message: "Backup uploaded successfully!",
      file: response.data,
    });
  } catch (err) {
    console.error("Backup error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
