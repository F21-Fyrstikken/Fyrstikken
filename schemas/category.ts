import { defineType, defineField } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
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
      name: "year",
      title: "Year",
      type: "reference",
      to: [{ type: "year" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Order in which this category appears within the year",
    }),
  ],
  preview: {
    select: {
      title: "title",
      year: "year.year",
      order: "order",
    },
    prepare({ title, year, order }) {
      const titleString = String(title);
      let subtitle = "No year";

      if (typeof year === "number") {
        subtitle = String(year);
        if (typeof order === "number") {
          subtitle = `${subtitle} - Order: ${String(order)}`;
        }
      }

      return {
        title: titleString,
        subtitle: subtitle,
      };
    },
  },
});
