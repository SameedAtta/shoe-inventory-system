const fs = require("fs-extra");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");

const CREDENTIALS_PATH = path.join(__dirname, "../credentials.json");
const TOKEN_PATH = path.join(__dirname, "../token.json");

(async function main() {
  const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, "utf8"));
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });

  console.log("Authorize this app by visiting this URL:\n", authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question("Enter the code from that page here: ", async (code) => {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await fs.writeJson(TOKEN_PATH, tokens);
    console.log("✅ Google Drive token stored successfully!");
    rl.close();
  });
})();
