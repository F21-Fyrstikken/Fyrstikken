/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

declare module "astro-portabletext" {
  import type { AstroComponentFactory } from "astro/runtime/server/index.js";
  import type { PortableTextBlock } from "@portabletext/types";

  interface IPortableTextComponents {
    type?: Record<string, AstroComponentFactory>;
    block?: Record<string, AstroComponentFactory>;
    mark?: Record<string, AstroComponentFactory>;
    list?: Record<string, AstroComponentFactory>;
    listItem?: Record<string, AstroComponentFactory>;
  }

  interface IPortableTextProps {
    value: PortableTextBlock | PortableTextBlock[];
    components?: IPortableTextComponents;
  }

  export const PortableText: AstroComponentFactory<IPortableTextProps>;
}
