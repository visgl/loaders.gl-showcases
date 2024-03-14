module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  extends: ["standard-with-typescript", "plugin:react/recommended"],
  // ignorePatterns: ["**/*.html"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}", "src/**/*.ts", "src/**/*.tsx"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.eslint.json"],
  },
  plugins: ["react"],
  rules: {
    "@typescript-eslint/semi": ["error", "always"],
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        enums: "always-multiline",
        functions: "never",
      },
    ],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: { delimiter: "semi", requireLast: true },
        singleline: { delimiter: "semi", requireLast: false },
        multilineDetection: "brackets",
      },
    ],
    "@typescript-eslint/space-before-function-paren": "off",
  },
  settings: {
    react: {
      version: "18.2",
    },
  },
};
