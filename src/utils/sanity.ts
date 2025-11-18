import type { ISanityImage } from "../types/sanity";

export function getImageUrl(image?: ISanityImage): string | undefined {
  return image?.asset?.url;
}

export function getImageAlt(image?: ISanityImage, fallback = ""): string {
  return image?.alt ?? fallback;
}

export function parseYearId(yearId: string): number {
  return Number.parseInt(yearId, 10);
}
