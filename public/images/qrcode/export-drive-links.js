const fs = require("fs");
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const TOKEN_PATH = path.join(__dirname, "token.json");

function parseArg(name, fallback = "") {
  const p = process.argv.find((a) => a.startsWith(`--${name}=`));
  return p ? p.split("=").slice(1).join("=") : fallback;
}

const rootFolderId = parseArg("root");
const outputPath = path.join(__dirname, parseArg("out", "links_for_qr.csv"));

if (!rootFolderId) {
  console.error("Missing root folder id. Example:");
  console.error("npm run drive:export-links -- --root=YOUR_FOLDER_ID");
  process.exit(1);
}

function escapeCsv(value) {
  const s = String(value == null ? "" : value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function authorize() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error("credentials.json not found in project folder.");
  }
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const cfg = credentials.installed || credentials.web;

  if (!cfg || !cfg.client_id || !cfg.client_secret) {
    throw new Error("Invalid credentials.json format. Expected installed/web OAuth client.");
  }

  const oAuth2Client = new google.auth.OAuth2(
    cfg.client_id,
    cfg.client_secret,
    (cfg.redirect_uris && cfg.redirect_uris[0]) || "http://localhost"
  );

  // Prefer existing token to avoid repeated browser prompts.
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  }

  // First-time auth (opens browser).
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(auth.credentials, null, 2), "utf8");

  oAuth2Client.setCredentials(auth.credentials);
  return oAuth2Client;
}

async function listChildFolders(drive, parentId) {
  const result = await drive.files.list({
    q: `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id,name,webViewLink)",
    pageSize: 1000,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  return result.data.files || [];
}

async function main() {
  const auth = await authorize();
  const drive = google.drive({ version: "v3", auth });

  const rows = [["hive_name", "subfolder_name", "folder_path", "folder_url"]];

  const hiveFolders = await listChildFolders(drive, rootFolderId);
  if (hiveFolders.length === 0) {
    throw new Error("No child folders found under the provided root folder.");
  }

  for (const hive of hiveFolders) {
    const subfolders = await listChildFolders(drive, hive.id);

    for (const sub of subfolders) {
      rows.push([hive.name, sub.name, `${hive.name}/${sub.name}`, sub.webViewLink || ""]);
    }
  }

  const csv = rows.map((r) => r.map(escapeCsv).join(",")).join("\n") + "\n";
  fs.writeFileSync(outputPath, csv, "utf8");

  console.log(`Exported ${rows.length - 1} links to: ${outputPath}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

