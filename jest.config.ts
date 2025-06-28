import * as path from "path";

const rootDir = path.resolve(__dirname, '.');

/** @type {import('jest').Config} */
const config = {
  maxWorkers: "50%",
  preset: 'ts-jest',
  restoreMocks: true,
  clearMocks: true,
  collectCoverage: true,
  coverageReporters: ["json", "html", "text"],
  // coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/dist/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  // testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  modulePaths: [
    "<rootDir>"
  ],
  rootDir,
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};

// Use export default because .mjs files are ES modules
export default config;