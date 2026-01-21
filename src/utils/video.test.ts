import { describe, it, expect } from "vitest";
import { getYouTubeId, getVimeoId } from "./video";

describe("video utilities", () => {
  describe("getYouTubeId", () => {
    it("extracts ID from standard YouTube URL", () => {
      expect(getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("extracts ID from short YouTube URL", () => {
      expect(getYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("extracts ID from embed URL", () => {
      expect(getYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });

    it("extracts ID from URL with additional parameters", () => {
      expect(getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120")).toBe("dQw4w9WgXcQ");
    });

    it("extracts ID from URL with playlist", () => {
      expect(getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLtest")).toBe("dQw4w9WgXcQ");
    });

    it("returns null for invalid URL", () => {
      expect(getYouTubeId("https://example.com/video")).toBeNull();
    });

    it("returns null for URL with wrong ID length", () => {
      expect(getYouTubeId("https://www.youtube.com/watch?v=short")).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(getYouTubeId("")).toBeNull();
    });
  });

  describe("getVimeoId", () => {
    it("extracts ID from standard Vimeo URL", () => {
      expect(getVimeoId("https://vimeo.com/123456789")).toBe("123456789");
    });

    it("extracts ID from player URL", () => {
      expect(getVimeoId("https://player.vimeo.com/video/123456789")).toBe("123456789");
    });

    it("extracts ID from channel video URL", () => {
      expect(getVimeoId("https://vimeo.com/channels/staffpicks/123456789")).toBe("123456789");
    });

    it("extracts ID from group video URL", () => {
      expect(getVimeoId("https://vimeo.com/groups/animation/videos/123456789")).toBe("123456789");
    });

    it("extracts ID from album video URL", () => {
      expect(getVimeoId("https://vimeo.com/album/12345/video/123456789")).toBe("123456789");
    });

    it("extracts ID from URL with hash", () => {
      expect(getVimeoId("https://vimeo.com/123456789/abc123def")).toBe("123456789");
    });

    it("returns null for invalid URL", () => {
      expect(getVimeoId("https://example.com/video")).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(getVimeoId("")).toBeNull();
    });
  });
});
