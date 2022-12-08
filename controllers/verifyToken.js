const jsonwebtoken = require('jsonwebtoken');
const secrets = require('../config/secrets');

verifyToken = function(req) {
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
}

exports.verifyToken = verifyToken;