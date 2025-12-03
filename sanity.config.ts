import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";
import { structure } from "./schemas/structure";
import { SANITY_CONFIG } from "./src/constants/config";

export default defineConfig({
  name: "project-name",
  title: "Project Name",
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
