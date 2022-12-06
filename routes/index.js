module.exports = function (app, router) {
    app.use('/api', require('./users.js')(router));
    app.use('/api', require('./venues.js')(router));
    app.use('/api', require('./events.js')(router));
    app.use('/api', require('./reviews.js')(router));
    app.use('/api', require('./map.js')(router));
};
