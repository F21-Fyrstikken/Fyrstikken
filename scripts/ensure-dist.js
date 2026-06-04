/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const requiredBuildFiles = ["dist/index.html", "dist/studio/index.html"];

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {void}
 */
function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });

  if (result.error !== undefined) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (requiredBuildFiles.every((path) => existsSync(path))) {
  console.warn("dist already exists; skipping build");
  process.exit(0);
}

if (!existsSync("node_modules/.modules.yaml")) {
  run("corepack", ["pnpm", "install", "--frozen-lockfile"]);
}

run("corepack", ["pnpm", "build:all"]);
