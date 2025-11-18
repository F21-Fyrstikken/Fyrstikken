// @ts-check
import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import { SANITY_CONFIG } from "./src/constants/config";

export default defineConfig({
  base: import.meta.env.DEV ? "/" : "/Fyrstikken/",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [
    sanity({
      ...SANITY_CONFIG,
      useCdn: import.meta.env.PROD,
    }),
    react(),
  ],
});
