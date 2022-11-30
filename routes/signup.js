var secrets = require('../config/secrets');

module.exports = function (router) {

    var signupRoute = router.route('/signup');

    signupRoute.post(function (req, res) {
        const User = require("../models/user");
        const user = new User(req.body);
        user.save((err, user) => {
            if (err) {
                return res.status(400).json({message: "Create User Failed", data: {}});
            }

            return res.status(201).json({message: "User Created", data: user});
        })
    });

    return router;
}

