import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist", ".astro", "node_modules"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      sonarjs: sonarjsPlugin,
    },
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      // SonarJS rules
      "sonarjs/no-duplicate-string": "error",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-redundant-boolean": "warn",
      "sonarjs/no-unused-collection": "error",
      "sonarjs/no-useless-catch": "warn",
      "sonarjs/prefer-immediate-return": "warn",
      "sonarjs/no-collapsible-if": "error",
      "sonarjs/no-gratuitous-expressions": "error",
      "sonarjs/no-inverted-boolean-check": "warn",
      "sonarjs/prefer-while": "warn",
      "sonarjs/cognitive-complexity": ["error", 15],
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettier,
];
