import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";

const TS_JS_FILES = "**/*.{js,mjs,cjs,ts,tsx}";

export default [
  {
    ignores: ["dist", "node_modules", "**/.astro/**", "!**/*.astro", ".netlify/**"],
  },
  eslint.configs.recommended,
  // Base TypeScript configs for all files
  ...tseslint.configs.recommended,
  // Strict type-checked rules ONLY for TS/JS files (not Astro)
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: [TS_JS_FILES],
  })),
  ...tseslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: [TS_JS_FILES],
  })),
  {
    files: [TS_JS_FILES],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    rules: {
      // Override to allow common patterns in Astro files
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: [TS_JS_FILES], // Apply custom rules only to TS/JS files
    plugins: {
      sonarjs: sonarjsPlugin,
    },
    rules: {
      // Base ESLint rules
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "warn",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "warn",
      "no-duplicate-imports": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-throw-literal": "error",
      "no-return-await": "error",

      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/strict-boolean-expressions": [
        "warn",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: false,
        },
      ],
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-unnecessary-condition": "warn",

      // Naming conventions
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        {
          selector: "class",
          format: ["PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase"],
        },
      ],

      // SonarJS rules for code quality
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
  ...eslintPluginAstro.configs.recommended,
];
