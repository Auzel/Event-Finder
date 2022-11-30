var secrets = require('../config/secrets');


var reviewController = require('../controllers/reviewController');
var venueController = require('../controllers/venueController');
var eventController = require('../controllers/eventController');

module.exports = function (router) {

    var homeRoute = router.route('/');
    var venueRoute = router.route('/venues');
    var eventRoute = router.route('/event');
    var reviewRoute = router.route('/reviews');
    
    var specifiedVenueRoute = router.route('/venues/:id')
    var specifiedReviewRoute = router.route('/reviews/:id')
    var specifiedEventRoute = router.route('/events/:id')


    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });
    
    reviewRoute.get((req, res) => reviewController.getReviewList(req, res));
    reviewRoute.post((req, res) => reviewController.createReview(req, res));
    specifiedReviewRoute.get((req, res) => reviewController.getReview(req, res));
    specifiedReviewRoute.delete((req, res) => reviewController.deleteReview(req, res));
    specifiedReviewRoute.put((req, res) => reviewController.replaceReview(req, res));

    venueRoute.get((req, res) => venueController.getVenueList(req, res));
    specifiedVenueRoute.get((req, res) => venueController.getVenue(req, res));

    eventRoute.get((req, res) => eventController.getEventList(req, res));
    specifiedEventRoute.get((req, res) => eventController.getEvent(req, res));



    return router;
}

