/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@server$": "<rootDir>/src/server",
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!**/node_modules/**",
    "!src/pre-start",
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  testMatch: ["<rootDir>/__tests__/**/*.+(test|spec).[jt]s?(x)"],
};
