import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const rootDir = process.cwd();
const workbookPath = path.join(rootDir, "Categorisation_Produits_ExpertCN_v6.xlsx");
const outputDir = path.join(rootDir, ".codex-tmp", "catalogue-v6-inspection");

await fs.mkdir(outputDir, { recursive: true });

const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const summary = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 12,
  tableMaxCols: 12,
  tableMaxCellChars: 160,
});

await fs.writeFile(path.join(outputDir, "summary.ndjson"), summary.ndjson, "utf8");

const sheetList = await workbook.inspect({
  kind: "sheet",
  include: "id,name",
  maxChars: 6000,
});
await fs.writeFile(path.join(outputDir, "sheets.ndjson"), sheetList.ndjson, "utf8");

const sheetNames = [];
for (const line of sheetList.ndjson.split(/\r?\n/)) {
  if (!line.trim()) continue;
  const record = JSON.parse(line);
  const name = record.name ?? record.sheetName;
  if (name) sheetNames.push(name);
}

for (const sheetName of sheetNames) {
  const sheet = workbook.worksheets.getItem(sheetName);
  const usedRange = sheet.getUsedRange();
  await fs.writeFile(
    path.join(outputDir, `${sheetName.replace(/[<>:"/\\|?*]/g, "_")}.json`),
    JSON.stringify(usedRange.values, null, 2),
    "utf8",
  );

  const preview = await workbook.render({
    sheetName,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  const safeName = sheetName.replace(/[<>:"/\\|?*]/g, "_");
  await fs.writeFile(
    path.join(outputDir, `${safeName}.png`),
    new Uint8Array(await preview.arrayBuffer()),
  );
}

console.log(summary.ndjson);
console.log(JSON.stringify({ sheetNames, outputDir }, null, 2));
