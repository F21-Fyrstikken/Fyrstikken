import { sanityClient } from "sanity:client";
import type { SanityClient } from "@sanity/client";

export const client: SanityClient = sanityClient;

interface IYear {
  _id: string;
  year: number;
  description?: string;
}

interface ICategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  coverImage?: {
    asset?: { url: string };
    alt?: string;
  };
  order?: number;
  year: number;
}

interface IProject {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image?: {
    asset?: { url: string };
    alt?: string;
  };
  order?: number;
  category: string;
  categorySlug: string;
}

interface IProjectDetail {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  content?: unknown;
  image?: {
    asset?: { url: string };
    alt?: string;
  };
  order?: number;
  category: {
    title: string;
    slug: { current: string };
    year: number;
  };
}

// Query to get all years
export async function getAllYears(): Promise<IYear[]> {
  return client.fetch(
    `*[_type == "year"] | order(year desc) {
      _id,
      year,
      description
    }`
  );
}

// Query to get a specific year
export async function getYear(yearId: string): Promise<IYear | null> {
  return client.fetch(
    `*[_type == "year" && year == $yearId][0] {
      _id,
      year,
      description
    }`,
    { yearId: parseInt(yearId) }
  );
}

// Query to get categories for a specific year
export async function getCategoriesForYear(yearId: string): Promise<ICategory[]> {
  return client.fetch(
    `*[_type == "category" && year->year == $yearId] | order(order asc) {
      _id,
      title,
      slug,
      description,
      coverImage {
        asset->{
          url
        },
        alt
      },
      order,
      "year": year->year
    }`,
    { yearId: parseInt(yearId) }
  );
}

// Query to get a specific category
export async function getCategory(slug: string): Promise<ICategory | null> {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      coverImage {
        asset->{
          url
        },
        alt
      },
      order,
      "year": year->year
    }`,
    { slug }
  );
}

// Query to get projects for a specific category
export async function getProjectsForCategory(categorySlug: string): Promise<IProject[]> {
  return client.fetch(
    `*[_type == "project" && category->slug.current == $categorySlug] | order(order asc) {
      _id,
      title,
      slug,
      description,
      image {
        asset->{
          url
        },
        alt
      },
      order,
      "category": category->title,
      "categorySlug": category->slug.current
    }`,
    { categorySlug }
  );
}

// Query to get a specific project
export async function getProject(slug: string): Promise<IProjectDetail | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      content,
      image {
        asset->{
          url
        },
        alt
      },
      order,
      "category": category->{
        title,
        slug,
        "year": year->year
      }
    }`,
    { slug }
  );
}
