var message = require('../models/message');
const User = require("../models/user");
const {validationResult} = require('express-validator');

const createUser = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(message.response(errors.array()[0].msg, {}));
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json(message.response("Email already exists", {}));
        }

        return res.status(201).json(message.response("Created User", user));
    });
}


const getUser = function(req, res) {
    
}


const replaceUser = function(req, res) {
}

exports.createUser = createUser;
exports.getUser = getUser;
exports.replaceUser = replaceUser;