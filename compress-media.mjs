// Media asset compression script using sharp
// Compresses PNG and JPEG files in the web/public directory
import sharp from "sharp";
import { readdir, stat, rename, copyFile, mkdir, unlink } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "public");
const BACKUP_DIR = join(__dirname, ".media-backup");

const results = [];

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function compressFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return;

  const beforeStat = await stat(filePath);
  const beforeKB = beforeStat.size / 1024;

  // Skip tiny files (< 5KB) - not worth compressing
  if (beforeKB < 5) {
    results.push({
      file: filePath.replace(PUBLIC_DIR, ""),
      type: ext.slice(1),
      beforeKB: Math.round(beforeKB * 10) / 10,
      afterKB: Math.round(beforeKB * 10) / 10,
      reduction: "0%",
      skipped: true,
    });
    return;
  }

  // Back up original
  const relPath = filePath.replace(PUBLIC_DIR, "");
  const backupPath = join(BACKUP_DIR, relPath);
  await mkdir(dirname(backupPath), { recursive: true });
  await copyFile(filePath, backupPath);

  const tmpPath = filePath + ".tmp";

  try {
    if (ext === ".png") {
      // For PNGs: use palette mode with compression level 9
      // This works well for both logos (limited colors) and photos
      await sharp(filePath)
        .png({
          quality: 85,
          compressionLevel: 9,
          palette: true,
          effort: 10,
        })
        .toFile(tmpPath);
    } else {
      // For JPEGs: use mozjpeg for better compression
      await sharp(filePath)
        .jpeg({
          quality: 80,
          mozjpeg: true,
          chromaSubsampling: "4:2:0",
        })
        .toFile(tmpPath);
    }

    const afterStat = await stat(tmpPath);
    const afterKB = afterStat.size / 1024;

    // Only replace if compressed version is actually smaller
    if (afterStat.size < beforeStat.size) {
      const reduction = Math.round(
        ((beforeStat.size - afterStat.size) / beforeStat.size) * 100
      );
      await rename(tmpPath, filePath);
      results.push({
        file: relPath,
        type: ext.slice(1),
        beforeKB: Math.round(beforeKB * 10) / 10,
        afterKB: Math.round(afterKB * 10) / 10,
        reduction: `${reduction}%`,
        skipped: false,
      });
    } else {
      // Compressed version is not smaller, keep original
      await unlink(tmpPath);
      results.push({
        file: relPath,
        type: ext.slice(1),
        beforeKB: Math.round(beforeKB * 10) / 10,
        afterKB: Math.round(beforeKB * 10) / 10,
        reduction: "0%",
        skipped: false,
      });
    }
  } catch (err) {
    console.error(`Error compressing ${filePath}: ${err.message}`);
    try {
      await unlink(tmpPath);
    } catch {}
  }
}

async function main() {
  console.log("=== Media Asset Compression ===\n");
  console.log(`Source: ${PUBLIC_DIR}`);
  console.log(`Backup: ${BACKUP_DIR}\n`);

  await mkdir(BACKUP_DIR, { recursive: true });

  let totalBefore = 0;
  let totalAfter = 0;

  for await (const file of walk(PUBLIC_DIR)) {
    await compressFile(file);
  }

  // Sort results by reduction descending
  results.sort((a, b) => {
    const aRed = parseInt(a.reduction);
    const bRed = parseInt(b.reduction);
    return bRed - aRed;
  });

  // Print table
  console.log("\nCompression Results:");
  console.log("-".repeat(85));
  console.log(
    "File".padEnd(50) +
      "Type".padEnd(6) +
      "Before".padStart(10) +
      "After".padStart(10) +
      "Reduction".padStart(10)
  );
  console.log("-".repeat(85));

  for (const r of results) {
    console.log(
      r.file.padEnd(50) +
        r.type.padEnd(6) +
        (r.beforeKB + " KB").padStart(10) +
        (r.afterKB + " KB").padStart(10) +
        (r.reduction + (r.skipped ? " (skip)" : "")).padStart(10)
    );
    totalBefore += r.beforeKB;
    totalAfter += r.afterKB;
  }

  console.log("-".repeat(85));
  const totalReduction = Math.round(
    ((totalBefore - totalAfter) / totalBefore) * 100
  );
  console.log(
    "TOTAL".padEnd(56) +
      (totalBefore.toFixed(1) + " KB").padStart(10) +
      (totalAfter.toFixed(1) + " KB").padStart(10) +
      (totalReduction + "%").padStart(10)
  );
  console.log(
    `\nTotal saved: ${(totalBefore - totalAfter).toFixed(1)} KB (${(totalBefore - totalAfter) / 1024 >= 1 ? ((totalBefore - totalAfter) / 1024).toFixed(2) + " MB" : ""})`
  );
  console.log(`Originals backed up to: ${BACKUP_DIR}`);
}

main().catch(console.error);
