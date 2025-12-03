/// <reference types="@sanity/astro/module" />
/// <reference types="astro/client" />

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
    value: PortableTextBlock | PortableTextBlock[] | unknown;
    components?: IPortableTextComponents;
  }

  export const PortableText: AstroComponentFactory<IPortableTextProps>;
}
