// @ts-check
import { defineConfig } from "astro/config";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  base: import.meta.env.DEV ? "/" : "/Fyrstikken/",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [
    sanity({
      projectId: "531mn2v8",
      dataset: "production",
      useCdn: false, // Use Live API for real-time updates during development
    }),
    react(),
  ],
});
