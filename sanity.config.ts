import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";
import { structure } from "./schemas/structure";
import { SANITY_CONFIG, SITE_CONFIG } from "./src/config";

export default defineConfig({
  name: "fyrstikken",
  title: SITE_CONFIG.name,
  projectId: SANITY_CONFIG.projectId,
  dataset: SANITY_CONFIG.dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
