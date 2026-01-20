export function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = regExp.exec(url);
  return match !== null && match[2].length === 11 ? match[2] : null;
}

export function getVimeoId(url: string): string | null {
  const regExp =
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|))(\d+)(?:[a-zA-Z0-9_-]+)?/;
  const match = regExp.exec(url);
  return match !== null ? match[1] : null;
}
