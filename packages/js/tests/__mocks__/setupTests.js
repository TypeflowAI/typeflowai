import fetchMock from "jest-fetch-mock";

/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: "jsdom",
};

fetchMock.enableMocks();

module.exports = config;
