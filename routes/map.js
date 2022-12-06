var secrets = require('../config/secrets');

var mapController = require('../controllers/mapController');

module.exports = function (router) {
    var mapRoute = router.route('/map');
    mapRoute.get((req, res) => mapController.getMap(req, res));

    return router;
}

