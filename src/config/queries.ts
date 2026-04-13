/**
 * GROQ Queries for Sanity CMS
 *
 * All queries are centralized here for maintainability.
 * Learn GROQ: https://www.sanity.io/docs/groq
 */
export const GROQ_QUERIES = {
  /**
   * Get all years, sorted newest first
   */
  ALL_YEARS: `*[_type == "year"] | order(year desc) {
    _id,
    year,
    description
  }`,

  /**
   * Get a single year by its numeric ID (e.g., 2024)
   * @param $yearId - The year number
   */
  YEAR_BY_ID: `*[_type == "year" && year == $yearId][0] {
    _id,
    year,
    description
  }`,

  /**
   * Get all categories for a specific year
   * @param $yearId - The year number
   */
  CATEGORIES_FOR_YEAR: `*[_type == "category" && year->year == $yearId] | order(order asc) {
    _id,
    title,
    slug,
    description,
    coverImage {
      asset->{ url },
      alt
    },
    order,
    "year": year->year
  }`,

  /**
   * Get a single category by its slug
   * @param $slug - The category slug (e.g., "film")
   */
  CATEGORY_BY_SLUG: `*[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    coverImage {
      asset->{ url },
      alt
    },
    order,
    "year": year->year
  }`,

  /**
   * Get all projects in a category
   * @param $categorySlug - The category slug
   */
  PROJECTS_FOR_CATEGORY: `*[_type == "project" && category->slug.current == $categorySlug] | order(order asc) {
    _id,
    title,
    slug,
    description,
    image {
      asset->{ url },
      alt
    },
    order,
    "category": category->title,
    "categorySlug": category->slug.current
  }`,

  /**
   * Get a single project by its slug
   * @param $slug - The project slug
   */
  PROJECT_BY_SLUG: `*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    content,
    image {
      asset->{ url },
      alt
    },
    order,
    "category": category->{
      title,
      slug,
      "year": year->year
    }
  }`,

  /**
   * Get all categories with their projects for a year
   * Used on year overview pages
   * @param $yearId - The year number
   */
  CATEGORIES_WITH_PROJECTS_FOR_YEAR: `*[_type == "category" && year->year == $yearId] | order(order asc) {
    _id,
    title,
    slug,
    description,
    order,
    "projects": *[_type == "project" && category._ref == ^._id] | order(order asc) {
      _id,
      title,
      slug,
      description,
      content,
      image {
        asset->{ url },
        alt
      },
      order
    }
  }`,

  /**
   * Get ALL projects with full details in a single query
   * Optimized for static site generation (SSG) - fetches everything at build time
   * Includes sibling projects for navigation
   */
  ALL_PROJECTS_WITH_DETAILS: `*[_type == "project"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    content,
    image {
      asset->{ url },
      alt
    },
    order,
    "category": category->{
      _id,
      title,
      slug,
      "year": year->year
    },
    "siblingProjects": *[_type == "project" && category._ref == ^.category._ref] | order(order asc) {
      _id,
      title,
      slug,
      description,
      image {
        asset->{ url },
        alt
      },
      order
    }
  }`,

  /**
   * Get ALL categories with their projects
   * Optimized for SSG - single query for category pages
   */
  ALL_CATEGORIES_WITH_PROJECTS: `*[_type == "category"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    coverImage {
      asset->{ url },
      alt
    },
    order,
    "year": year->year,
    "projects": *[_type == "project" && category._ref == ^._id] | order(order asc) {
      _id,
      title,
      slug,
      description,
      image {
        asset->{ url },
        alt
      },
      order
    }
  }`,

  CATEGORIES_FOR_SUBMISSION: `*[_type == "category" && year->year == $yearId] | order(order asc) {
    _id,
    title
  }`,
} as const;
