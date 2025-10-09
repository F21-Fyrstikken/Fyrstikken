import { defineType, defineField } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "External link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                  {
                    title: "Open in new tab",
                    name: "blank",
                    type: "boolean",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          title: "Image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
        {
          name: "youtube",
          type: "object",
          title: "YouTube Video",
          fields: [
            {
              name: "url",
              type: "url",
              title: "YouTube URL",
              description: "Full YouTube URL or embed URL",
            },
          ],
        },
        {
          name: "vimeo",
          type: "object",
          title: "Vimeo Video",
          fields: [
            {
              name: "url",
              type: "url",
              title: "Vimeo URL",
            },
          ],
        },
        {
          name: "embed",
          type: "object",
          title: "Embed (iframe)",
          fields: [
            {
              name: "url",
              type: "url",
              title: "Embed URL",
              description: "Any embeddable URL (YouTube, Vimeo, etc.)",
            },
            {
              name: "height",
              type: "number",
              title: "Height (optional)",
              description: "Height in pixels",
            },
          ],
        },
        {
          name: "file",
          type: "file",
          title: "File",
          description: "Upload any file (PDF, ZIP, etc.)",
        },
      ],
      description: "Rich content with text, images, videos, and more",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
        },
      ],
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Order in which this project appears within the category",
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      media: "image",
      order: "order",
    },
    prepare({ title, category, media, order }) {
      const titleString = String(title);
      let subtitle = "No category";

      if (typeof category === "string" && category.length > 0) {
        subtitle = category;
        if (typeof order === "number") {
          subtitle = `${subtitle} - Order: ${String(order)}`;
        }
      }

      return {
        title: titleString,
        subtitle: subtitle,
        media: media as never,
      };
    },
  },
});
