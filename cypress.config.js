// eslint-disable-next-line
require('dotenv').config();
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: process.env.CYPRESS_IO_PROJECT_ID,
  e2e: {
    baseUrl: `${process.env.SERVER_URL}`,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  retries: 5,
});
