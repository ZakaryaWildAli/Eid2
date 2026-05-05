const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "drive_upload_root");

const structure = [
  { folderName: "منحل الدار", count: 70 },
  { folderName: "منحل بطن الغول", count: 50 },
  { folderName: "منحل الزعرورة", count: 60 },
  { folderName: "منحل المصفات", count: 30 },
];

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function safeName(name) {
  return name.replace(/[\\/:*?"<>|]/g, "_").trim();
}

function main() {
  ensureDir(rootDir);

  for (const { folderName, count } of structure) {
    const hivePath = path.join(rootDir, safeName(folderName));
    ensureDir(hivePath);

    for (let i = 1; i <= count; i += 1) {
      const subFolderPath = path.join(hivePath, String(i));
      ensureDir(subFolderPath);
    }
  }

  console.log(`Created local folder structure at: ${rootDir}`);
  console.log("Each hive contains numbered subfolders (1, 2, 3, ...).");
}

main();

