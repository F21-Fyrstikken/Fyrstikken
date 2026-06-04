/**
 * Sanity CMS utility functions for working with images, files, and assets
 * @module utils/sanity
 */

import { SANITY_CONFIG } from "../config";
import type { ISanityImage } from "../types/sanity";

export interface IImageUrlOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  autoFormat?: boolean;
}

const DEFAULT_IMAGE_QUALITY = 75;
const SANITY_IMAGE_CDN_HOST = "https://cdn.sanity.io/images/";

function buildImageParams(options: IImageUrlOptions = {}): string {
  const params = new URLSearchParams();
  const quality = options.quality ?? DEFAULT_IMAGE_QUALITY;
  const fit = options.fit ?? "max";

  if (options.width !== undefined) {
    params.set("w", String(options.width));
  }
  if (options.height !== undefined) {
    params.set("h", String(options.height));
  }
  if (options.autoFormat !== false) {
    params.set("auto", "format");
  }
  params.set("fit", fit);
  params.set("q", String(quality));

  return params.toString();
}

function appendImageParams(url: string, options?: IImageUrlOptions): string {
  if (!url.startsWith(SANITY_IMAGE_CDN_HOST)) {
    return url;
  }

  const params = buildImageParams(options);
  return `${url}${url.includes("?") ? "&" : "?"}${params}`;
}

/**
 * Gets the URL from a Sanity image object
 * @param image - Sanity image object with asset reference
 * @returns The image URL, or undefined if not available
 */
export function getImageUrl(image?: ISanityImage, options?: IImageUrlOptions): string | undefined {
  if (image?.asset?._ref !== undefined) {
    return buildImageUrl(image.asset._ref, options);
  }
  if (image?.asset?.url !== undefined) {
    return appendImageParams(image.asset.url, options);
  }
  return undefined;
}

/**
 * Gets the alt text from a Sanity image object
 * @param image - Sanity image object
 * @param fallback - Fallback text if alt is not defined (default: '')
 * @returns The alt text or fallback
 */
export function getImageAlt(image?: ISanityImage, fallback = ""): string {
  return image?.alt ?? fallback;
}

/**
 * Parses a year ID string to a number
 * @param yearId - Year as a string
 * @returns Year as a number
 */
export function parseYearId(yearId: string): number {
  return Number.parseInt(yearId, 10);
}

/**
 * Builds a CDN URL for a Sanity file from its reference
 * @param ref - Sanity file reference (e.g., 'file-abc123-pdf')
 * @returns Full CDN URL to the file
 * @example
 * buildFileUrl('file-abc123-pdf') // 'https://cdn.sanity.io/files/{projectId}/{dataset}/abc123.pdf'
 */
export function buildFileUrl(ref: string): string {
  const refWithoutPrefix = ref.replace(/^file-/, "");
  const lastDashIndex = refWithoutPrefix.lastIndexOf("-");
  const id = refWithoutPrefix.substring(0, lastDashIndex);
  const extension = refWithoutPrefix.substring(lastDashIndex + 1);
  return `https://cdn.sanity.io/files/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}.${extension}`;
}

/**
 * Builds a CDN URL for a Sanity image from its reference
 * @param ref - Sanity image reference (e.g., 'image-abc123-800x600-jpg')
 * @returns Full CDN URL to the image
 * @example
 * buildImageUrl('image-abc123-800x600-jpg') // 'https://cdn.sanity.io/images/{projectId}/{dataset}/abc123-800x600.jpg?auto=format&fit=max&q=75'
 */
export function buildImageUrl(ref: string, options?: IImageUrlOptions): string {
  const refWithoutPrefix = ref.replace(/^image-/, "");
  const parts = refWithoutPrefix.split("-");
  const format = parts[parts.length - 1];
  const dimensions = parts[parts.length - 2];
  const id = parts.slice(0, -2).join("-");
  return appendImageParams(
    `https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}-${dimensions}.${format}`,
    options
  );
}

/**
 * Gets the URL from a Sanity file asset, handling both direct URLs and references
 * @param asset - Sanity asset object with optional url or _ref
 * @returns The file URL, or empty string if not available
 */
export function getFileUrl(asset?: { url?: string; _ref?: string }): string {
  if (asset === undefined) {
    return "";
  }
  if (asset.url !== undefined && asset.url !== "") {
    return asset.url;
  }
  if (asset._ref !== undefined && asset._ref !== "") {
    return buildFileUrl(asset._ref);
  }
  return "";
}

/**
 * Extracts the filename from a URL
 * @param url - Full URL to a file
 * @param fallback - Fallback filename if extraction fails (default: 'File')
 * @returns The filename
 * @example
 * getFilenameFromUrl('https://cdn.sanity.io/files/proj/prod/abc123.pdf') // 'abc123.pdf'
 */
export function getFilenameFromUrl(url: string, fallback = "File"): string {
  const filename = url.split("/").pop();
  return filename !== undefined && filename !== "" ? filename : fallback;
}

/**
 * Gets the MIME type for an audio file based on its extension
 * @param filename - Filename with extension
 * @returns MIME type string (defaults to 'audio/mpeg' for unknown extensions)
 * @example
 * getAudioMimeType('song.mp3') // 'audio/mpeg'
 * getAudioMimeType('sound.wav') // 'audio/wav'
 */
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
