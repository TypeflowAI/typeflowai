module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-typeflowai`
  extends: ["typeflowai"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
