/**
  - @see https://prettier.io/docs/configuration
  - @type {import("prettier").Config}
 */

const config = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
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
