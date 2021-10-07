module.exports = {
  root: true,
  env: {
    node: true,
    "jest/globals": true,
  },
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "prettier",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "@typescript-eslint/ban-ts-comment": "warn",
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
};
