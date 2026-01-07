import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const repoRoot = path.resolve(process.cwd(), "..", "..");

const WEBP_DIRS = [
  "assets/graphics/hero",
  "assets/graphics/photos",
  "assets/graphics/abstract",
];

const SVG_WRAPPER_DIRS = ["assets/graphics/icons", "assets/graphics/spot"];

const RASTER_EXTS = new Set([".png", ".jpg", ".jpeg"]);

function isRaster(p) {
  return RASTER_EXTS.has(path.extname(p).toLowerCase());
}

async function safeUnlink(fileAbs) {
  try {
    await fs.unlink(fileAbs);
    return true;
  } catch (e) {
    // On Windows files can be locked by preview/IDE => EPERM.
    if (e && (e.code === "EPERM" || e.code === "EACCES")) {
      try {
        await fs.chmod(fileAbs, 0o666);
        await fs.unlink(fileAbs);
        return true;
      } catch {
        return false;
      }
    }
    throw e;
  }
}

async function exists(fileAbs) {
  try {
    await fs.access(fileAbs);
    return true;
  } catch {
    return false;
  }
}

async function listFilesRecursive(dirAbs) {
  const out = [];
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dirAbs, e.name);
    if (e.isDirectory()) {
      out.push(...(await listFilesRecursive(full)));
    } else if (e.isFile()) {
      out.push(full);
    }
  }
  return out;
}

async function ensureDir(dirAbs) {
  await fs.mkdir(dirAbs, { recursive: true });
}

async function convertToWebp(srcAbs) {
  const srcRel = path.relative(repoRoot, srcAbs);
  const outAbs = srcAbs.replace(/\.(png|jpe?g)$/i, ".webp");

  if (await exists(outAbs)) {
    // If WebP already exists, we only try to remove the original (best-effort).
    const removed = await safeUnlink(srcAbs);
    return {
      srcRel,
      outRel: path.relative(repoRoot, outAbs),
      skipped: true,
      removedOriginal: removed,
    };
  }

  const img = sharp(srcAbs, { failOn: "none" });
  // Balanced defaults: good quality for UI while keeping size down
  await img.webp({ quality: 82, effort: 5 }).toFile(outAbs);

  const removed = await safeUnlink(srcAbs);
  return {
    srcRel,
    outRel: path.relative(repoRoot, outAbs),
    removedOriginal: removed,
  };
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;");
}

async function makeSvgWrapper(srcAbs) {
  const srcRel = path.relative(repoRoot, srcAbs);
  const outAbs = srcAbs.replace(/\.(png|jpe?g)$/i, ".svg");

  if (await exists(outAbs)) {
    const removed = await safeUnlink(srcAbs);
    return {
      srcRel,
      outRel: path.relative(repoRoot, outAbs),
      skipped: true,
      removedOriginal: removed,
    };
  }

  const img = sharp(srcAbs, { failOn: "none" });
  const meta = await img.metadata();
  if (!meta.width || !meta.height) {
    throw new Error(`Cannot read dimensions for ${srcRel}`);
  }

  const buf = await fs.readFile(srcAbs);
  const ext = path.extname(srcAbs).toLowerCase();
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  const dataUri = `data:${mime};base64,${buf.toString("base64")}`;

  const svg = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${meta.width}" height="${meta.height}" viewBox="0 0 ${meta.width} ${meta.height}">`,
    `<image width="${meta.width}" height="${meta.height}" xlink:href="${escapeAttr(dataUri)}" />`,
    `</svg>`,
    ``,
  ].join("\n");

  await fs.writeFile(outAbs, svg, "utf8");
  const removed = await safeUnlink(srcAbs);
  return {
    srcRel,
    outRel: path.relative(repoRoot, outAbs),
    removedOriginal: removed,
  };
}

async function run() {
  const results = { webp: [], svg: [] };

  for (const dir of WEBP_DIRS) {
    const absDir = path.join(repoRoot, dir);
    await ensureDir(absDir);
    const files = (await listFilesRecursive(absDir)).filter(isRaster);
    for (const f of files) {
      results.webp.push(await convertToWebp(f));
    }
  }

  for (const dir of SVG_WRAPPER_DIRS) {
    const absDir = path.join(repoRoot, dir);
    await ensureDir(absDir);
    const files = (await listFilesRecursive(absDir)).filter(isRaster);
    for (const f of files) {
      results.svg.push(await makeSvgWrapper(f));
    }
  }

  const logAbs = path.join(repoRoot, "tools/asset-pipeline/last-run.json");
  await fs.writeFile(logAbs, JSON.stringify(results, null, 2) + "\n", "utf8");

  console.log(`Converted to WebP: ${results.webp.length}`);
  console.log(`Converted to SVG wrappers: ${results.svg.length}`);
  console.log(`Log: ${path.relative(repoRoot, logAbs)}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

