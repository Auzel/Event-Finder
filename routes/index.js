module.exports = function (app, router) {
    app.use('/api', require('./signup.js')(router));
};
