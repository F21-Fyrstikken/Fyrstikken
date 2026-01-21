/**
 * Video utility functions for extracting IDs from YouTube and Vimeo URLs
 * @module utils/video
 */

/**
 * Extracts the video ID from a YouTube URL
 * @param url - YouTube URL (supports various formats: youtu.be, watch, embed, etc.)
 * @returns The 11-character video ID, or null if not found
 * @example
 * getYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ') // 'dQw4w9WgXcQ'
 * getYouTubeId('https://youtu.be/dQw4w9WgXcQ') // 'dQw4w9WgXcQ'
 */
export function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = regExp.exec(url);
  return match !== null && match[2].length === 11 ? match[2] : null;
}

/**
 * Extracts the video ID from a Vimeo URL
 * @param url - Vimeo URL (supports various formats: video, channels, groups, etc.)
 * @returns The numeric video ID, or null if not found
 * @example
 * getVimeoId('https://vimeo.com/123456789') // '123456789'
 * getVimeoId('https://vimeo.com/channels/staffpicks/123456789') // '123456789'
 */
export function getVimeoId(url: string): string | null {
  const regExp =
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|))(\d+)(?:[a-zA-Z0-9_-]+)?/;
  const match = regExp.exec(url);
  return match !== null ? match[1] : null;
}
