import { defineType, defineField } from "sanity";

export default defineType({
  name: "year",
  title: "Year",
  type: "document",
  fields: [
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) => rule.required().min(1900).max(2100),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Optional description for this year",
    }),
  ],
  preview: {
    select: {
      year: "year",
      description: "description",
    },
    prepare({ year, description }) {
      const yearString = String(year);
      const subtitle = typeof description === "string" && description.length > 0 ? description : "No description";
      return {
        title: yearString,
        subtitle: subtitle,
      };
    },
  },
});
