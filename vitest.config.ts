import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Use the same environment as Astro
    environment: "node",
    // Include test files
    include: ["src/**/*.test.ts"],
    // Coverage configuration
    coverage: {
      provider: "v8",
      include: ["src/utils/**", "src/config/**", "src/lib/**"],
      exclude: ["**/*.d.ts", "**/*.test.ts"],
    },
    // Global test timeout
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      // Allow importing from src/ with @/
      "@": "/src",
    },
  },
});
