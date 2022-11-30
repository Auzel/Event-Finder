var secrets = require('../config/secrets');
var {check} = require('express-validator');

module.exports = function (router) {
    var userController = require('../controllers/userController');
    var userRoute = router.route('/users');
    var specifiedUserRoute = router.route('/users/:username')

    userRoute.post([
        check("name", "Name cannot be empty").isLength({min: 1}),
        check("username", "Username cannot be empty").isLength({min: 1}),
        check("email", "Email should be valid").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({min: 6})
    ], userController.createUser);
    // specifiedUserRoute.get((req, res) => userController.getUser(req, res));
    // specifiedUserRoute.put((req, res) => userController.replaceUser(req, res));

    return router;
}

