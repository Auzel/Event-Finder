const secrets = require('../config/secrets');
const message = require('../models/message');
const User = require("../models/user");
const {validationResult} = require('express-validator');
const {verifyToken} = require("./verifyToken");
const jsonwebtoken = require('jsonwebtoken');

const createUser = function(req, res) {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json(message.response(err.message, {}));
        }

        const token = jsonwebtoken.sign({_id: user._id}, secrets.jwt_sign_phrase);
        return res.cookie('token', token, {expire: new Date() + 3}).status(201).json(message.response("Created User", {token: token, _id: user._id, username: user.username, email: user.email}));
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
            return res.cookie('token', token, {expire: new Date() + 3}).status(200).json(message.response("User signed in", {token: token, _id: user._id, username: user.username, email: user.email}));
        } else {
            return res.status(400).json(message.response("Email and password don't match", {}));
        }

    } catch (err) {
        return res.status(500).json(message.response("Sign in Failed", {}));
    }
}

const signout = function(req, res) {
    try {
        if (!verifyToken(req)) {
            return res.status(401).json(message.response("Unauthorized", {})); 
        }

        res.clearCookie("token");
        return res.status(200).json(message.response("Signout Successful", {}));
    } catch (err) {
        return res.status(500).json(message.response("Signout Failed", {}));
    }
}


const getUser = async function(req, res) {
    try {
        if (!verifyToken(req)) {
            return res.status(401).json(message.response("Unauthorized", {})); 
        }

        let user = await User.findById(req.body._id).exec();
        if (!user) {
            return res.status(404).json(message.response("User Not Found", {}));
        } else {
            return res.status(200).json(message.response("OK", {_id: user._id, name: user.name, username: user.username, email: user.email, eventPrefs: user.eventPrefs, reviews: user.reviews ? user.reviews : []}));
        }
    } catch (err) {
        return res.status(500).json(message.response("Get User Failed", {}));
    }
}


const replaceUser = async function(req, res) {
    try {
        if (!verifyToken(req)) {
            return res.status(401).json(message.response("Unauthorized", {})); 
        }
        
        let old_user = await User.findById(req.body._id).exec();
        if (!old_user) {
            return res.status(404).json(message.response("User Not Found", {}));
        }

        req.body.reviews = old_user.reviews;

        let new_user = new User(req.body);
        let user = await User.findByIdAndUpdate(new_user._id, new_user, {new: true}).exec();
        if (!user) {
            return res.status(404).json(message.response("User Not Found", {}));
        } else {
            return res.status(200).json(message.response("OK", {_id: user._id, name: user.name, username: user.username, email: user.email, eventPrefs: user.eventPrefs, reviews: user.reviews ? user.reviews : []}));
        }

    } catch (err) {
        return res.status(500).json(message.response("Replace User Failed", {}));
    }
}

const checkSignin = function(req, res) {
    try {
        if (!verifyToken(req)) {
            return res.status(401).json(message.response("Unauthorized", {})); 
        }
        return res.status(200).json(message.response("OK", {}));
    } catch (err) {
        return res.status(500).json(message.response("Check Signin Failed", {}));
    }
}

exports.createUser = createUser;
exports.getUser = getUser;
exports.replaceUser = replaceUser;
exports.signin = signin;
exports.signout = signout;
exports.checkSignin = checkSignin;