/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

async function copyStudio() {
  const studioSource = "studio";
  const studioDestination = join("dist", "studio");

  if (!existsSync(studioSource)) {
    console.error("Error: Studio build not found. Run 'npm run build:sanity' first.");
    process.exit(1);
  }

  if (!existsSync("dist")) {
    console.error("Error: Astro dist folder not found. Run 'npm run build' first.");
    process.exit(1);
  }

  try {
    // Create studio directory in dist if it doesn't exist
    if (!existsSync(studioDestination)) {
      await mkdir(studioDestination, { recursive: true });
    }

    // Copy studio build to dist/studio
    await cp(studioSource, studioDestination, { recursive: true });
    console.error("✓ Sanity Studio copied to dist/studio");

    // Rewrite asset paths in index.html so they resolve under /studio/
    // Sanity builds with root-relative paths (/static/...) but the studio
    // is served from /studio/, so assets live at /studio/static/...
    const indexPath = join(studioDestination, "index.html");
    const html = await readFile(indexPath, "utf-8");
    const rewritten = html.replaceAll('"/static/', '"/studio/static/');
    await writeFile(indexPath, rewritten, "utf-8");
    console.error("✓ Rewritten asset paths for /studio/ base path");
  } catch (error) {
    console.error("Error copying studio:", error);
    process.exit(1);
  }
}

await copyStudio();
