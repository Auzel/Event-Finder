var secrets = require('../config/secrets');
var {check} = require('express-validator');



module.exports = function (router) {
    var userController = require('../controllers/userController');
    var signupRoute = router.route('/signup');
    var signinRoute = router.route('/signin');
    var signoutRoute = router.route('/signout');
    var userRoute = router.route('/users')

    signupRoute.post(userController.createUser);
    signinRoute.post(userController.signin);
    signinRoute.get(userController.checkSignin);
    signoutRoute.get(userController.signout);
    userRoute.get(userController.getUser);
    userRoute.put(userController.replaceUser);

    return router;
}

