import { describe, it, expect } from "vitest";
import { GROQ_QUERIES } from "./queries";

describe("GROQ queries", () => {
  describe("query structure", () => {
    it("ALL_YEARS query is defined", () => {
      expect(GROQ_QUERIES.ALL_YEARS).toBeDefined();
      expect(GROQ_QUERIES.ALL_YEARS).toContain('_type == "year"');
      expect(GROQ_QUERIES.ALL_YEARS).toContain("order(year desc)");
    });

    it("YEAR_BY_ID query uses $yearId parameter", () => {
      expect(GROQ_QUERIES.YEAR_BY_ID).toBeDefined();
      expect(GROQ_QUERIES.YEAR_BY_ID).toContain("$yearId");
      expect(GROQ_QUERIES.YEAR_BY_ID).toContain("[0]"); // Single result
    });

    it("CATEGORIES_FOR_YEAR query uses $yearId parameter", () => {
      expect(GROQ_QUERIES.CATEGORIES_FOR_YEAR).toBeDefined();
      expect(GROQ_QUERIES.CATEGORIES_FOR_YEAR).toContain("$yearId");
      expect(GROQ_QUERIES.CATEGORIES_FOR_YEAR).toContain('_type == "category"');
    });

    it("CATEGORY_BY_SLUG query uses $slug parameter", () => {
      expect(GROQ_QUERIES.CATEGORY_BY_SLUG).toBeDefined();
      expect(GROQ_QUERIES.CATEGORY_BY_SLUG).toContain("$slug");
      expect(GROQ_QUERIES.CATEGORY_BY_SLUG).toContain("slug.current");
    });

    it("PROJECTS_FOR_CATEGORY query uses $categorySlug parameter", () => {
      expect(GROQ_QUERIES.PROJECTS_FOR_CATEGORY).toBeDefined();
      expect(GROQ_QUERIES.PROJECTS_FOR_CATEGORY).toContain("$categorySlug");
      expect(GROQ_QUERIES.PROJECTS_FOR_CATEGORY).toContain('_type == "project"');
    });

    it("PROJECT_BY_SLUG query uses $slug parameter", () => {
      expect(GROQ_QUERIES.PROJECT_BY_SLUG).toBeDefined();
      expect(GROQ_QUERIES.PROJECT_BY_SLUG).toContain("$slug");
      expect(GROQ_QUERIES.PROJECT_BY_SLUG).toContain("content");
    });
  });

  describe("batch queries", () => {
    it("CATEGORIES_WITH_PROJECTS_FOR_YEAR includes nested projects", () => {
      expect(GROQ_QUERIES.CATEGORIES_WITH_PROJECTS_FOR_YEAR).toBeDefined();
      expect(GROQ_QUERIES.CATEGORIES_WITH_PROJECTS_FOR_YEAR).toContain('"projects"');
      expect(GROQ_QUERIES.CATEGORIES_WITH_PROJECTS_FOR_YEAR).toContain("^._id");
    });

    it("ALL_PROJECTS_WITH_DETAILS includes sibling projects", () => {
      expect(GROQ_QUERIES.ALL_PROJECTS_WITH_DETAILS).toBeDefined();
      expect(GROQ_QUERIES.ALL_PROJECTS_WITH_DETAILS).toContain('"siblingProjects"');
      expect(GROQ_QUERIES.ALL_PROJECTS_WITH_DETAILS).toContain("category._ref");
    });

    it("ALL_CATEGORIES_WITH_PROJECTS fetches all categories", () => {
      expect(GROQ_QUERIES.ALL_CATEGORIES_WITH_PROJECTS).toBeDefined();
      expect(GROQ_QUERIES.ALL_CATEGORIES_WITH_PROJECTS).toContain('_type == "category"');
      expect(GROQ_QUERIES.ALL_CATEGORIES_WITH_PROJECTS).toContain('"projects"');
      expect(GROQ_QUERIES.ALL_CATEGORIES_WITH_PROJECTS).toContain('"year"');
    });
  });

  describe("query completeness", () => {
    const requiredQueries = [
      "ALL_YEARS",
      "YEAR_BY_ID",
      "CATEGORIES_FOR_YEAR",
      "CATEGORY_BY_SLUG",
      "PROJECTS_FOR_CATEGORY",
      "PROJECT_BY_SLUG",
      "CATEGORIES_WITH_PROJECTS_FOR_YEAR",
      "ALL_PROJECTS_WITH_DETAILS",
      "ALL_CATEGORIES_WITH_PROJECTS",
    ];

    it.each(requiredQueries)("has %s query defined", (queryName) => {
      expect(GROQ_QUERIES[queryName as keyof typeof GROQ_QUERIES]).toBeDefined();
    });
  });
});
