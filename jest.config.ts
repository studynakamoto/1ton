import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.spec.ts"],
  globalSetup: undefined,
  globalTeardown: undefined,
};

export default config;
