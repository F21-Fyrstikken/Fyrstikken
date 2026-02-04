import { describe, it, expect } from "vitest";
import { buildYearPath, buildCategoryPath, buildProjectPath } from "./paths";

const BASE_PATH = "/base";
const YEAR = "2024";
const YEAR_NUM = 2024;
const CATEGORY = "film";
const PROJECT = "my-project";

describe("path utilities", () => {
  describe("buildYearPath", () => {
    it("builds year path with string year", () => {
      expect(buildYearPath(BASE_PATH, YEAR)).toBe("/base/years/2024");
    });

    it("builds year path with numeric year", () => {
      expect(buildYearPath(BASE_PATH, YEAR_NUM)).toBe("/base/years/2024");
    });

    it("handles empty base path", () => {
      expect(buildYearPath("", YEAR)).toBe("/years/2024");
    });

    it("handles base path with trailing content", () => {
      expect(buildYearPath("/Fyrstikken", YEAR)).toBe("/Fyrstikken/years/2024");
    });
  });

  describe("buildCategoryPath", () => {
    it("builds category path", () => {
      expect(buildCategoryPath(BASE_PATH, YEAR, CATEGORY)).toBe("/base/years/2024/film");
    });

    it("handles category with special characters", () => {
      expect(buildCategoryPath(BASE_PATH, YEAR, "visuell-identitet")).toBe("/base/years/2024/visuell-identitet");
    });

    it("handles numeric year", () => {
      expect(buildCategoryPath(BASE_PATH, YEAR_NUM, CATEGORY)).toBe("/base/years/2024/film");
    });
  });

  describe("buildProjectPath", () => {
    it("builds full project path", () => {
      expect(buildProjectPath(BASE_PATH, YEAR, CATEGORY, PROJECT)).toBe("/base/years/2024/film/my-project");
    });

    it("handles empty base path", () => {
      expect(buildProjectPath("", YEAR, CATEGORY, PROJECT)).toBe("/years/2024/film/my-project");
    });

    it("handles numeric year", () => {
      expect(buildProjectPath(BASE_PATH, YEAR_NUM, CATEGORY, PROJECT)).toBe("/base/years/2024/film/my-project");
    });
  });

  // Note: getBasePath cannot be easily tested as it relies on import.meta.env
  // which requires special Vite/Vitest configuration for mocking
});
