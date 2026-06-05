import { describe, it, expect } from "vitest";
import {
  getImageUrl,
  getImageAlt,
  parseYearId,
  buildFileUrl,
  buildImageUrl,
  getFileUrl,
  getFilenameFromUrl,
  getAudioMimeType,
} from "./sanity";
import type { ISanityImage } from "../types/sanity";

// Test constants
const EXAMPLE_IMAGE_URL = "https://example.com/image.jpg";
const SANITY_IMAGE_URL = "https://cdn.sanity.io/images/531mn2v8/production/abc123-800x600.jpg";
const EXAMPLE_FILE_URL = "https://example.com/file.pdf";
const FILE_REF = "file-abc123-pdf";
const IMAGE_REF = "image-abc123-800x600-jpg";
const CDN_FILES_PATH = "cdn.sanity.io/files";
const CDN_IMAGES_PATH = "cdn.sanity.io/images";
const AUDIO_MPEG = "audio/mpeg";

describe("sanity utilities", () => {
  describe("getImageUrl", () => {
    it("returns URL from image asset", () => {
      const image: ISanityImage = { asset: { url: EXAMPLE_IMAGE_URL } };
      expect(getImageUrl(image)).toBe(EXAMPLE_IMAGE_URL);
    });

    it("adds optimization params to direct Sanity image URLs when requested", () => {
      const image: ISanityImage = { asset: { url: SANITY_IMAGE_URL } };
      expect(getImageUrl(image, { width: 640, height: 440, quality: 60 })).toBe(
        `${SANITY_IMAGE_URL}?w=640&h=440&auto=format&fit=max&q=60`
      );
    });

    it("builds optimized URL from image asset reference when requested", () => {
      const image: ISanityImage = { asset: { _ref: IMAGE_REF } };
      expect(getImageUrl(image, { width: 640, quality: 60 })).toContain(
        "abc123-800x600.jpg?w=640&auto=format&fit=max&q=60"
      );
    });

    it("returns undefined for image without asset", () => {
      const image: ISanityImage = {};
      expect(getImageUrl(image)).toBeUndefined();
    });

    it("returns undefined for undefined image", () => {
      expect(getImageUrl(undefined)).toBeUndefined();
    });
  });

  describe("getImageAlt", () => {
    it("returns alt text from image", () => {
      const image: ISanityImage = { alt: "A beautiful sunset" };
      expect(getImageAlt(image)).toBe("A beautiful sunset");
    });

    it("returns fallback when alt is undefined", () => {
      const image: ISanityImage = {};
      expect(getImageAlt(image, "Default alt")).toBe("Default alt");
    });

    it("returns empty string as default fallback", () => {
      expect(getImageAlt(undefined)).toBe("");
    });

    it("returns fallback for undefined image", () => {
      expect(getImageAlt(undefined, "Fallback")).toBe("Fallback");
    });
  });

  describe("parseYearId", () => {
    it("parses string year to number", () => {
      expect(parseYearId("2024")).toBe(2024);
    });

    it("parses year with leading zeros", () => {
      expect(parseYearId("02024")).toBe(2024);
    });

    it("returns NaN for non-numeric string", () => {
      expect(parseYearId("invalid")).toBeNaN();
    });
  });

  describe("buildFileUrl", () => {
    it("builds URL from file reference", () => {
      const url = buildFileUrl(FILE_REF);
      expect(url).toContain(CDN_FILES_PATH);
      expect(url).toContain("abc123.pdf");
    });

    it("handles reference without file- prefix", () => {
      const ref = "abc123-pdf";
      const url = buildFileUrl(ref);
      expect(url).toContain("abc123.pdf");
    });
  });

  describe("buildImageUrl", () => {
    it("builds URL from image reference", () => {
      const url = buildImageUrl(IMAGE_REF);
      expect(url).toContain(CDN_IMAGES_PATH);
      expect(url).toContain("abc123-800x600.jpg");
      expect(url).not.toContain("auto=format");
    });

    it("handles reference without image- prefix", () => {
      const ref = "abc123-800x600-png";
      const url = buildImageUrl(ref);
      expect(url).toContain("abc123-800x600.png");
    });

    it("supports custom image dimensions and quality", () => {
      const url = buildImageUrl(IMAGE_REF, { width: 640, height: 440, quality: 60 });
      expect(url).toContain("w=640");
      expect(url).toContain("h=440");
      expect(url).toContain("q=60");
    });
  });

  describe("getFileUrl", () => {
    it("returns direct URL when available", () => {
      const asset = { url: EXAMPLE_FILE_URL };
      expect(getFileUrl(asset)).toBe(EXAMPLE_FILE_URL);
    });

    it("builds URL from _ref when URL not available", () => {
      const asset = { _ref: FILE_REF };
      const url = getFileUrl(asset);
      expect(url).toContain(CDN_FILES_PATH);
    });

    it("prefers URL over _ref", () => {
      const asset = { url: EXAMPLE_FILE_URL, _ref: FILE_REF };
      expect(getFileUrl(asset)).toBe(EXAMPLE_FILE_URL);
    });

    it("returns empty string for undefined asset", () => {
      expect(getFileUrl(undefined)).toBe("");
    });

    it("returns empty string for empty asset", () => {
      expect(getFileUrl({})).toBe("");
    });
  });

  describe("getFilenameFromUrl", () => {
    it("extracts filename from URL", () => {
      expect(getFilenameFromUrl("https://example.com/path/to/document.pdf")).toBe("document.pdf");
    });

    it("returns fallback for URL ending with slash", () => {
      expect(getFilenameFromUrl("https://example.com/")).toBe("File");
    });

    it("returns custom fallback for trailing slash", () => {
      expect(getFilenameFromUrl("https://example.com/", "Download")).toBe("Download");
    });
  });

  describe("getAudioMimeType", () => {
    it("returns correct mime type for mp3", () => {
      expect(getAudioMimeType("song.mp3")).toBe(AUDIO_MPEG);
    });

    it("returns correct mime type for wav", () => {
      expect(getAudioMimeType("song.wav")).toBe("audio/wav");
    });

    it("returns correct mime type for ogg", () => {
      expect(getAudioMimeType("song.ogg")).toBe("audio/ogg");
    });

    it("returns correct mime type for m4a", () => {
      expect(getAudioMimeType("song.m4a")).toBe("audio/mp4");
    });

    it("returns audio/mpeg as default for unknown extension", () => {
      expect(getAudioMimeType("song.unknown")).toBe(AUDIO_MPEG);
    });

    it("handles uppercase extensions", () => {
      expect(getAudioMimeType("song.MP3")).toBe(AUDIO_MPEG);
    });

    it("handles filename without extension", () => {
      expect(getAudioMimeType("song")).toBe(AUDIO_MPEG);
    });
  });
});
