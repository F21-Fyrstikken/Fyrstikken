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
const EXAMPLE_FILE_URL = "https://example.com/file.pdf";
const FILE_REF = "file-abc123-pdf";
const CDN_FILES_PATH = "cdn.sanity.io/files";
const CDN_IMAGES_PATH = "cdn.sanity.io/images";
const AUDIO_MPEG = "audio/mpeg";

describe("sanity utilities", () => {
  describe("getImageUrl", () => {
    it("returns URL from image asset", () => {
      const image: ISanityImage = { asset: { url: EXAMPLE_IMAGE_URL } };
      expect(getImageUrl(image)).toBe(EXAMPLE_IMAGE_URL);
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
      const ref = "image-abc123-800x600-jpg";
      const url = buildImageUrl(ref);
      expect(url).toContain(CDN_IMAGES_PATH);
      expect(url).toContain("abc123-800x600.jpg");
    });

    it("handles reference without image- prefix", () => {
      const ref = "abc123-800x600-png";
      const url = buildImageUrl(ref);
      expect(url).toContain("abc123-800x600.png");
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

    it("returns empty string for URL ending with slash", () => {
      expect(getFilenameFromUrl("https://example.com/")).toBe("");
    });

    it("returns last segment which is empty for trailing slash", () => {
      // Note: The function returns the last path segment, which is empty string for trailing slash
      // The fallback only applies when .pop() returns undefined (not empty string)
      expect(getFilenameFromUrl("https://example.com/")).toBe("");
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
