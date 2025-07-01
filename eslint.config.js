export default [
  {
    ignores: ["dist/", ".parcel-cache/", "node_modules/"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        HTMLElement: "readonly",
        customElements: "readonly",
        Element: "readonly",
        ShadowRoot: "readonly",
        history: "readonly",
        location: "readonly",
        navigator: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off", // Allow console for debugging
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
];
