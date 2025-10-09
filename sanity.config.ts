import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";
import { structure } from "./schemas/structure";

export default defineConfig({
  name: "project-name",
  title: "Project Name",
  projectId: "531mn2v8",
  dataset: "production",
  plugins: [
    structureTool({
      structure,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
