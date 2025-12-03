export interface ISanityImage {
  asset?: { url: string };
  alt?: string;
}

export interface ISlug {
  current: string;
}

export interface IYear {
  _id: string;
  year: number;
  description?: string;
}

export interface ICategory {
  _id: string;
  title: string;
  slug: ISlug;
  description?: string;
  coverImage?: ISanityImage;
  order?: number;
  year: number;
}

export interface IProject {
  _id: string;
  title: string;
  slug: ISlug;
  description?: string;
  image?: ISanityImage;
  order?: number;
  category: string;
  categorySlug: string;
}

export interface IProjectDetail {
  _id: string;
  title: string;
  slug: ISlug;
  description?: string;
  content?: unknown;
  image?: ISanityImage;
  order?: number;
  category: {
    title: string;
    slug: ISlug;
    year: number;
  };
}

export interface ICategoryWithProjects {
  _id: string;
  title: string;
  slug: ISlug;
  description?: string;
  order?: number;
  projects?: IProject[];
}

export interface IProjectWithSiblings {
  _id: string;
  title: string;
  slug: ISlug;
  description?: string;
  content?: unknown;
  image?: ISanityImage;
  order?: number;
  category: {
    _id: string;
    title: string;
    slug: ISlug;
    year: number;
  };
  siblingProjects: IProject[];
}
