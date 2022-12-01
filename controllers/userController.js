const secrets = require('../config/secrets');
const message = require('../models/message');
const User = require("../models/user");
const {validationResult} = require('express-validator');
const jsonwebtoken = require('jsonwebtoken');

const createUser = function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(message.response(errors.array()[0].msg, {}));
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json(message.response(err.message, {}));
        }

        const {_id, username, email} = user;
        return res.status(201).json(message.response("Created User", {_id: _id, username: username, email: email}));
    });
}

const signin = async function(req, res) {
    const {email: email, password: password} = req.body;
    try {
        var user = await User.findOne({email: email}).exec();
        if (!user) {
            return res.status(400).json(message.response("Email Not Found", {}));
        }

        if (user.authenticate(password)) {
            const token = jsonwebtoken.sign({_id: user._id}, secrets.jwt_sign_phrase);
            res.cookie('token', token, {expire: new Date() + 3});
            const {_id, username} = user;
            return res.status(200).json(message.response("User signed in", {token: token, user: {_id: _id, username: username, email: email}}));
        } else {
            return res.status(400).json(message.response("Email and password don't match", {}));
        }

    } catch (err) {
        return res.status(500).json(message.response("Sign in Failed", {}));
    }
}

const signout = function(req, res) {
    try {
        res.clearCookie("token");
        return res.status(200).json(message.response("Signout Successful", {}));
    } catch (err) {
        return res.status(500).json(message.response("Signout Failed", {}));
    }
}


const getUser = function(req, res) {
    
}


const replaceUser = function(req, res) {
}

exports.createUser = createUser;
exports.getUser = getUser;
exports.replaceUser = replaceUser;
exports.signin = signin;
exports.signout = signout;