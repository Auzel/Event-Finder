const jsonwebtoken = require('jsonwebtoken');
const secrets = require('../config/secrets');

verifyToken = function(req) {
    try {
        const bearerHeader = req.headers["authorization"];
        const bearerToken = bearerHeader.split(' ')[1]
        var output = true;
        jsonwebtoken.verify(bearerToken, secrets.jwt_sign_phrase, (err, decoded) => {
            if (err) {
                output = false;
            } else {
                req.body._id = decoded._id;
            }
        });

        return output;
    } catch {
        return false;
    }
}

exports.verifyToken = verifyToken;