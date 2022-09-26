// eslint-disable-next-line
require('dotenv').config();
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: "5t68y6",
  e2e: {
    baseUrl: `${process.env.SERVER_URL}`,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

});
