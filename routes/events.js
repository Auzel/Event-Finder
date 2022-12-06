var secrets = require('../config/secrets');

var eventController = require('../controllers/eventController');

module.exports = function (router) {
    var eventRoute = router.route('/events');
    var specifiedEventRoute = router.route('/events/:id')

    eventRoute.get((req, res) => eventController.getEventList(req, res));
    specifiedEventRoute.get((req, res) => eventController.getEvent(req, res));

    return router;
}

