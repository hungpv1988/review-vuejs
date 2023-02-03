const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    baseUrl: 'http://localhost:5174',
    getCampsUrl : 'https://timanh.com/v1/campaign/find',
    searchImagesUrl : 'https://timanh.com/v1/images/search-images'
  }
});
