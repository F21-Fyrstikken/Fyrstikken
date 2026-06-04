import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const requiredBuildFiles = ["dist/index.html", "dist/studio/index.html"];

if (requiredBuildFiles.every((path) => existsSync(path))) {
  console.warn("dist already exists; skipping build");
  process.exit(0);
}

const result = spawnSync("pnpm", ["build:all"], { stdio: "inherit" });
process.exit(result.status ?? 1);
