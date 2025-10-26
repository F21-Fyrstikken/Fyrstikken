// @ts-check
import { defineConfig } from "astro/config";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  base: "/Fyrstikken/",
  output: "static",
  integrations: [
    sanity({
      projectId: "531mn2v8",
      dataset: "production",
      useCdn: false, // Use Live API for real-time updates during development
    }),
    react(),
  ],
});
