module.exports = function (app, router) {
    app.use('/api', require('./users.js')(router));
};
