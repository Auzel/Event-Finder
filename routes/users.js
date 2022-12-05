var secrets = require('../config/secrets');
var {check} = require('express-validator');



module.exports = function (router) {
    var userController = require('../controllers/userController');
    var signupRoute = router.route('/signup');
    var signinRoute = router.route('/signin');
    var signoutRoute = router.route('/signout');
    var userRoute = router.route('/users')

    signupRoute.post([
        check("name", "Name cannot be empty").isLength({min: 1}),
        check("username", "Username cannot be empty").isLength({min: 1}),
        check("email", "Email should be valid").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({min: 6})
    ], userController.createUser);
    signinRoute.post(userController.signin);
    signinRoute.get(userController.checkSignin);
    signoutRoute.get(userController.signout);
    userRoute.get(userController.getUser);
    userRoute.put(userController.replaceUser);

    return router;
}

