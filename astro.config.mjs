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
      useCdn: import.meta.env.PROD, // Use CDN in production for SSG, Live API in dev
    }),
    react(),
  ],
});
