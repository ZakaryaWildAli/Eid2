const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "links_for_qr.csv");

const structure = [
  { hiveName: "منحل الدار", count: 70 },
  { hiveName: "منحل بطن الغول", count: 50 },
  { hiveName: "منحل الزعرورة", count: 60 },
  { hiveName: "منحل المصفات", count: 30 },
];

function escapeCsv(value) {
  const s = String(value == null ? "" : value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function main() {
  const rows = [["hive_name", "subfolder_name", "folder_path", "folder_url"]];

  for (const { hiveName, count } of structure) {
    for (let i = 1; i <= count; i += 1) {
      rows.push([hiveName, String(i), `${hiveName}/${i}`, ""]);
    }
  }

  const csv = rows.map((r) => r.map(escapeCsv).join(",")).join("\n") + "\n";
  fs.writeFileSync(outputPath, csv, "utf8");

  console.log(`Template written: ${outputPath}`);
  console.log(`Rows created (without header): ${rows.length - 1}`);
}

main();

