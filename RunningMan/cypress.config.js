const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    baseUrl: 'http://127.0.0.1:5174',
    getCampsUrl : 'https://yourbib.xyz/v1/campaign/find',
    searchImagesUrl : 'https://yourbib.xyz/v1/images/search-images'
  }
});
