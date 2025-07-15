/**
  - @see https://prettier.io/docs/configuration
  - @type {import("prettier").Config}
 */

const config = {
  tabWidth: 2,
  printWidth: 180,
  bracketSameLine: true,
  htmlWhitespaceSensitivity: "strict",
  endOfLine: "lf",
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

export default config;
