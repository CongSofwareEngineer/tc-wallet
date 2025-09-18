
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
]);

const prettierPlugin = require("eslint-plugin-prettier");
const jsxA11YPlugin = require("eslint-plugin-jsx-a11y");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");

// const typescriptEslint = require("@typescript-eslint/eslint-plugin");

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

module.exports = defineConfig([
  expoConfig,
  {
    // extends: ["plugin:unused-imports/recommended"],
    plugins: {
      prettier: prettierPlugin,
      "jsx-a11y": jsxA11YPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    ignores: ["dist/*", "android/*", "ios/*", ".expo/*"],
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": "warn",
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "no-unused-vars": "off",
      "react/self-closing-comp": "warn",
      "unused-imports/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "object",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],

          pathGroups: [
            {
              pattern: "~/**",
              group: "external",
              position: "after",
            },
          ],

          "newlines-between": "always",
        },
      ],
      // "padding-line-between-statements": [
      //   "warn",
      //   {
      //     blankLine: "always",
      //     prev: "*",
      //     next: "return",
      //   },
      //   {
      //     blankLine: "always",
      //     prev: ["const", "let", "var"],
      //     next: "*",
      //   },
      //   {
      //     blankLine: "any",
      //     prev: ["const", "let", "var"],
      //     next: ["const", "let", "var"],
      //   },
      // ],

      "prettier/prettier": [
        "warn",
        {
          printWidth: 150,
          semi: false,
          singleQuote: true, // 👈 BẮT BUỘC: dùng nháy đơn
          jsxSingleQuote: true, // 👈 Áp dụng luôn trong JSX
          trailingComma: "es5",
          jsxBracketSameLine: false,
          proseWrap: "always",
          endOfLine: "lf", // 👈 Sửa lỗi dòng xuống ␍
        },
      ],
    },
  },
]);
