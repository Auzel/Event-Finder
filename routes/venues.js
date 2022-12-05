var secrets = require('../config/secrets');

var venueController = require('../controllers/venueController');

module.exports = function (router) {
    var venueRoute = router.route('/venues');
    var specifiedVenueRoute = router.route('/venues/:id')

    venueRoute.get((req, res) => venueController.getVenueList(req, res));
    specifiedVenueRoute.get((req, res) => venueController.getVenue(req, res));

    return router;
}

