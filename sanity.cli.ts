import { defineCliConfig } from "sanity/cli";
import { SANITY_CONFIG } from "./src/constants/config";

export default defineCliConfig({
  api: {
    projectId: SANITY_CONFIG.projectId,
    dataset: SANITY_CONFIG.dataset,
  },
});
