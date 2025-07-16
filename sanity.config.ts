import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: "project-name",
  title: "Project Name",
  projectId: "531mn2v8",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [],
  },
});
