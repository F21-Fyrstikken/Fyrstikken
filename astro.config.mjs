// @ts-check
import { defineConfig } from "astro/config";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  base: "/",
  integrations: [
    sanity({
      projectId: "531mn2v8",
      dataset: "production",
    }),
    react(),
  ],

  adapter: netlify(),
});