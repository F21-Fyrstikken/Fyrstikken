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
];
