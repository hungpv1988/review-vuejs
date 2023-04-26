const { defineConfig } = require("cypress");
const fs = require('fs');
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        count(path) { // there is a name and arguments for a task
          return fs.readdirSync(path).length;
        },
      });

      return require('./cypress/plugins/index.js')(on, config)
    },
  },
  env: {
    baseUrl: 'http://localhost:5001',
    getCampsUrl : 'https://timanh.com/v1/campaign/find',
    searchImagesUrl : 'https://timanh.com/v1/images/search-images'
  }
});
