export const GROQ_QUERIES = {
  ALL_YEARS: `*[_type == "year"] | order(year desc) {
    _id,
    year,
    description
  }`,

  YEAR_BY_ID: `*[_type == "year" && year == $yearId][0] {
    _id,
    year,
    description
  }`,

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
} as const;
