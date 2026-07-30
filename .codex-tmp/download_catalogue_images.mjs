import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const rows = JSON.parse(
  await fs.readFile(
    path.join(rootDir, ".codex-tmp", "catalogue-v6-inspection", "Produits.json"),
    "utf8",
  ),
);
const outputDir = path.join(rootDir, "public", "images", "shop", "products");

await fs.mkdir(outputDir, { recursive: true });

const queue = rows.slice(1).filter((row) => row[6] && row[12]);
const results = [];

async function downloadRow(row) {
  const productName = row[0];
  const imageUrl = row[6];
  const imageFilename = row[12];

  const outputPath = path.join(outputDir, imageFilename);
  try {
    const existing = await fs.stat(outputPath).catch(() => null);
    if (existing?.size > 4000) {
      results.push({ productName, imageFilename, status: "existing" });
      return;
    }

    const response = await fetch(imageUrl, {
      headers: {
        "user-agent": "Mozilla/5.0 ExpertCN catalogue asset preparation",
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(18000),
      redirect: "follow",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length < 4000) throw new Error(`image too small (${bytes.length} bytes)`);
    await fs.writeFile(outputPath, bytes);
    results.push({ productName, imageFilename, status: "downloaded", bytes: bytes.length });
  } catch (error) {
    results.push({ productName, imageFilename, status: "remote-fallback", error: error.message });
  }
}

await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const row = queue.shift();
      if (row) await downloadRow(row);
    }
  }),
);

const counts = results.reduce((summary, item) => {
  summary[item.status] = (summary[item.status] || 0) + 1;
  return summary;
}, {});

await fs.writeFile(
  path.join(rootDir, ".codex-tmp", "catalogue-v6-inspection", "image-downloads.json"),
  JSON.stringify(results, null, 2),
  "utf8",
);

console.log(JSON.stringify(counts, null, 2));
