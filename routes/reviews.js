var secrets = require('../config/secrets');

var reviewController = require('../controllers/reviewController');

module.exports = function (router) {
    var reviewRoute = router.route('/reviews');
    var specifiedReviewRoute = router.route('/reviews/:id')

    reviewRoute.get((req, res) => reviewController.getReviewList(req, res));
    reviewRoute.post((req, res) => reviewController.createReview(req, res));
    specifiedReviewRoute.get((req, res) => reviewController.getReview(req, res));
    specifiedReviewRoute.delete((req, res) => reviewController.deleteReview(req, res));
    specifiedReviewRoute.put((req, res) => reviewController.replaceReview(req, res));

    return router;
}

