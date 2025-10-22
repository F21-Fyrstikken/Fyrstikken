import { cp, mkdir } from "node:fs/promises";
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
  } catch (error) {
    console.error("Error copying studio:", error);
    process.exit(1);
  }
}

await copyStudio();
