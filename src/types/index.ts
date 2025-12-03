/**
 * Common type definitions used across the application.
 * For Sanity-specific types, see ./sanity.ts
 */

// Navigation types
export interface IBreadcrumbItem {
  label: string;
  href: string;
}

// Component prop types that are reused
export interface ILinkProps {
  href: string;
  class?: string;
}

// Portable text node types
export interface IPortableTextNode<T = unknown> {
  node: T;
}

export interface IYouTubeNode {
  url: string;
}

export interface IVimeoNode {
  url: string;
}

export interface IEmbedNode {
  url: string;
  height?: number;
}

export interface ILinkButtonNode {
  text: string;
  url: string;
  style?: "primary" | "secondary";
  newTab?: boolean;
}

export interface IImageNode {
  asset: {
    _ref: string;
  };
  alt?: string;
  caption?: string;
}

export interface IFileNode {
  asset: {
    _ref: string;
    url?: string;
  };
}

export interface IAudioNode {
  asset: {
    _ref?: string;
    url?: string;
  };
}
