// @ts-check
import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";
import { SANITY_CONFIG } from "./src/config/index";

export default defineConfig({
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
  ],
});
