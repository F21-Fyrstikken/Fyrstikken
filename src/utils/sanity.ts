import { SANITY_CONFIG } from "../config";
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

export function buildFileUrl(ref: string): string {
  const refWithoutPrefix = ref.replace(/^file-/, "");
  const lastDashIndex = refWithoutPrefix.lastIndexOf("-");
  const id = refWithoutPrefix.substring(0, lastDashIndex);
  const extension = refWithoutPrefix.substring(lastDashIndex + 1);
  return `https://cdn.sanity.io/files/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}.${extension}`;
}

export function buildImageUrl(ref: string): string {
  const refWithoutPrefix = ref.replace(/^image-/, "");
  const parts = refWithoutPrefix.split("-");
  const format = parts[parts.length - 1];
  const dimensions = parts[parts.length - 2];
  const id = parts.slice(0, -2).join("-");
  return `https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}-${dimensions}.${format}`;
}

export function getFileUrl(asset?: { url?: string; _ref?: string }): string {
  if (asset === undefined) return "";
  if (asset.url !== undefined && asset.url !== "") return asset.url;
  if (asset._ref !== undefined && asset._ref !== "") return buildFileUrl(asset._ref);
  return "";
}

export function getFilenameFromUrl(url: string, fallback = "File"): string {
  return url.split("/").pop() ?? fallback;
}

export function getAudioMimeType(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  const mimeTypes: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    m4a: "audio/mp4",
  };
  return mimeTypes[extension] ?? "audio/mpeg";
}
