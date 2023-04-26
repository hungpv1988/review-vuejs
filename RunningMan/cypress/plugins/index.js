const unzipping = require('./unzipping')

module.exports = (on, config) => {
    on('task', {
        'unzipping': unzipping.unzip,
    })
}