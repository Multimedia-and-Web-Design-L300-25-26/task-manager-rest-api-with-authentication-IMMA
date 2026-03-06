export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  preset: "@shelf/jest-mongodb",
  testTimeout: 30000
};