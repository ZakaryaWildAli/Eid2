const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const { parse } = require("csv-parse/sync");
const { Jimp } = require("jimp");

const csvPath = path.join(__dirname, "links_for_qr.csv");
const logoPath = path.join(__dirname, "logo.png");
const outputDir = path.join(__dirname, "output");
const mappingPath = path.join(__dirname, "qr_mapping.csv");

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function pad3(n) {
  return String(n).padStart(3, "0");
}

function safeFilePart(name) {
  return String(name || "")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_");
}

function escapeCsv(value) {
  const s = String(value == null ? "" : value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function addLogoToQr(filePath) {
  if (!fs.existsSync(logoPath)) return false;

  const qrImage = await Jimp.read(filePath);
  const logoImage = await Jimp.read(logoPath);

  // Keep logo smaller and without white box for a cleaner appearance.
  const logoSize = Math.floor(qrImage.bitmap.width * 0.18);
  logoImage.resize({ w: logoSize, h: logoSize });

  const centerX = Math.floor((qrImage.bitmap.width - logoSize) / 2);
  const centerY = Math.floor((qrImage.bitmap.height - logoSize) / 2);
  qrImage.composite(logoImage, centerX, centerY);

  await qrImage.write(filePath);
  return true;
}

async function main() {
  if (!fs.existsSync(csvPath)) {
    console.error("links_for_qr.csv not found in project folder.");
    process.exit(1);
  }

  const csvRaw = fs.readFileSync(csvPath, "utf8");
  const records = parse(csvRaw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  if (!Array.isArray(records) || records.length === 0) {
    console.error(
      "links_for_qr.csv has no rows. Re-run the Google Apps Script so it writes folder links."
    );
    process.exit(1);
  }

  const requiredCols = ["hive_name", "subfolder_name", "folder_url"];
  for (const col of requiredCols) {
    if (!(col in records[0])) {
      console.error(
        `links_for_qr.csv is missing column '${col}'. Expected headers: hive_name, subfolder_name, folder_path, folder_url`
      );
      process.exit(1);
    }
  }

  ensureDir(outputDir);

  const mappingRows = [["output_file", "hive_name", "subfolder_name", "folder_url"]];
  let created = 0;

  for (const row of records) {
    const hive = row.hive_name;
    const sub = row.subfolder_name;
    const url = row.folder_url;

    if (!hive || !sub || !url) continue;

    const subNum = Number(sub);
    const subPart = Number.isFinite(subNum) ? pad3(subNum) : safeFilePart(sub);
    const fileName = `${safeFilePart(hive)}_${subPart}.png`;
    const filePath = path.join(outputDir, fileName);

    await QRCode.toFile(filePath, url, {
      errorCorrectionLevel: "H",
      type: "png",
      width: 512,
      margin: 2,
      color: { dark: "#000000", light: "#FFFFFF" },
    });

    await addLogoToQr(filePath);

    mappingRows.push([fileName, hive, sub, url]);
    created += 1;
  }

  fs.writeFileSync(
    mappingPath,
    mappingRows.map((r) => r.map(escapeCsv).join(",")).join("\n") + "\n",
    "utf8"
  );

  console.log(`Created ${created} QR codes in: ${outputDir}`);
  console.log(`Mapping saved to: ${mappingPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

