var secrets = require('../config/secrets');

var userController = require('../controllers/userController');
var reviewController = require('../controllers/reviewController');
var venueController = require('../controllers/venueController');
var eventController = require('../controllers/eventController');

module.exports = function (router) {

    var homeRoute = router.route('/');
    var userRoute = router.route('/users');
    var venueRoute = router.route('/venues');
    var eventRoute = router.route('/event');
    var reviewRoute = router.route('/reviews');

    var specifiedUserRoute = router.route('/users/:id')
    var specifiedVenueRoute = router.route('/venues/:id')
    var specifiedReviewRoute = router.route('/reviews/:id')
    var specifiedEventRoute = router.route('/events/:id')


    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });


    userRoute.get((req, res) => userController.getUserList(req, res));
    userRoute.post((req, res) => userController.createUser(req, res));
    specifiedUserRoute.get((req, res) => userController.getUser(req, res));
    specifiedUserRoute.delete((req, res) => userController.deleteUser(req, res));
    specifiedUserRoute.put((req, res) => userController.replaceUser(req, res));

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

