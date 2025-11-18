import { sanityClient } from "sanity:client";
import type { SanityClient } from "@sanity/client";
import { GROQ_QUERIES } from "../constants/queries";
import { parseYearId } from "../utils/sanity";
import type { IYear, ICategory, IProject, IProjectDetail, ICategoryWithProjects } from "../types/sanity";

export const client: SanityClient = sanityClient;

export type { IYear, ICategory, IProject, IProjectDetail, ICategoryWithProjects };

export async function getAllYears(): Promise<IYear[]> {
  return client.fetch(GROQ_QUERIES.ALL_YEARS);
}

export async function getYear(yearId: string): Promise<IYear | null> {
  return client.fetch(GROQ_QUERIES.YEAR_BY_ID, {
    yearId: parseYearId(yearId),
  });
}

export async function getCategoriesForYear(yearId: string): Promise<ICategory[]> {
  return client.fetch(GROQ_QUERIES.CATEGORIES_FOR_YEAR, {
    yearId: parseYearId(yearId),
  });
}

export async function getCategory(slug: string): Promise<ICategory | null> {
  return client.fetch(GROQ_QUERIES.CATEGORY_BY_SLUG, { slug });
}

export async function getProjectsForCategory(categorySlug: string): Promise<IProject[]> {
  return client.fetch(GROQ_QUERIES.PROJECTS_FOR_CATEGORY, { categorySlug });
}

export async function getProject(slug: string): Promise<IProjectDetail | null> {
  return client.fetch(GROQ_QUERIES.PROJECT_BY_SLUG, { slug });
}

export async function getCategoriesWithProjectsForYear(yearId: string): Promise<ICategoryWithProjects[]> {
  return client.fetch(GROQ_QUERIES.CATEGORIES_WITH_PROJECTS_FOR_YEAR, {
    yearId: parseYearId(yearId),
  });
}
