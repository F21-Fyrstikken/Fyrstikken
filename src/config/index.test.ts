import { describe, it, expect } from "vitest";
import { SANITY_CONFIG, SITE_CONFIG, THEME_COLORS } from "./index";

describe("config", () => {
  describe("SANITY_CONFIG", () => {
    it("has required projectId", () => {
      expect(SANITY_CONFIG.projectId).toBeDefined();
      expect(typeof SANITY_CONFIG.projectId).toBe("string");
      expect(SANITY_CONFIG.projectId.length).toBeGreaterThan(0);
    });

    it("has required dataset", () => {
      expect(SANITY_CONFIG.dataset).toBeDefined();
      expect(SANITY_CONFIG.dataset).toBe("production");
    });

    it("has required apiVersion", () => {
      expect(SANITY_CONFIG.apiVersion).toBeDefined();
      expect(SANITY_CONFIG.apiVersion).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("SITE_CONFIG", () => {
    it("has site name", () => {
      expect(SITE_CONFIG.name).toBe("Fyrstikken");
    });

    it("has description", () => {
      expect(SITE_CONFIG.description).toBeDefined();
      expect(typeof SITE_CONFIG.description).toBe("string");
    });

    it("has currentYear as number", () => {
      expect(typeof SITE_CONFIG.currentYear).toBe("number");
      expect(SITE_CONFIG.currentYear).toBeGreaterThanOrEqual(2024);
    });

    it("has locale", () => {
      expect(SITE_CONFIG.locale).toBe("nb-NO");
    });

    it("has fallbackUrl", () => {
      expect(SITE_CONFIG.fallbackUrl).toBeDefined();
      expect(SITE_CONFIG.fallbackUrl).toMatch(/^https?:\/\//);
    });
  });

  describe("THEME_COLORS", () => {
    it("has at least 10 color pairs", () => {
      expect(THEME_COLORS.length).toBeGreaterThanOrEqual(10);
    });

    it("each color has light and dark variants", () => {
      for (const color of THEME_COLORS) {
        expect(color).toHaveProperty("light");
        expect(color).toHaveProperty("dark");
        expect(color.light).toMatch(/^var\(--light-/);
        expect(color.dark).toMatch(/^var\(--dark-/);
      }
    });

    it("includes safir as first color (primary)", () => {
      expect(THEME_COLORS[0].light).toContain("safir");
      expect(THEME_COLORS[0].dark).toContain("safir");
    });
  });
});
