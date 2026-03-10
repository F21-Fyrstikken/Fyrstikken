/**
 * Path building utilities for generating URLs to pages
 * @module utils/paths
 */

/**
 * Builds the URL path to a year page
 * @param basePath - The base path of the site (e.g., '' or '/Fyrstikken')
 * @param year - The year (string or number)
 * @returns Full path to the year page
 * @example
 * buildYearPath('', 2024) // '/years/2024'
 * buildYearPath('/Fyrstikken', '2024') // '/Fyrstikken/years/2024'
 */
export function buildYearPath(basePath: string, year: string | number): string {
  return `${basePath}/years/${String(year)}`;
}

/**
 * Builds the URL path to a category page
 * @param basePath - The base path of the site
 * @param year - The year (string or number)
 * @param category - The category slug
 * @returns Full path to the category page
 * @example
 * buildCategoryPath('', 2024, 'film') // '/years/2024/film'
 */
export function buildCategoryPath(basePath: string, year: string | number, category: string): string {
  return `${basePath}/years/${String(year)}/${category}`;
}

/**
 * Builds the URL path to a project page
 * @param basePath - The base path of the site
 * @param year - The year (string or number)
 * @param category - The category slug
 * @param project - The project slug
 * @returns Full path to the project page
 * @example
 * buildProjectPath('', 2024, 'film', 'my-project') // '/years/2024/film/my-project'
 */
export function buildProjectPath(basePath: string, year: string | number, category: string, project: string): string {
  return `${basePath}/years/${String(year)}/${category}/${project}`;
}

/**
 * Gets the base path from the environment configuration
 * Removes trailing slash if present
 * @returns The base path (empty string if not configured)
 */
export function getBasePath(): string {
  const baseUrl = import.meta.env.BASE_URL;
  if (typeof baseUrl === "string") {
    return baseUrl.replace(/\/$/, "");
  }
  return "";
}
