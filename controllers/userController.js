
var secrets = require('../config/secrets');
var mongoose = require('mongoose');

var queryController = require('./queryController');
var message = require('../models/message');


const getUserList = function(req, res) {
    var query = new queryController.Query(req.query);

    mongoose.connect(secrets.mongo_connection, function(err, db) {
        if (err) {
            res.status(500).send(message.response("Invalid", "Server Error"));
            return;
        }

        let users = db.collection("users").aggregate(query.aggregation);

        users.toArray(function(err, result) {
            console.log(result);
            if (err) {
                res.status(500).send(message.response("Invalid", "Server Error"));
            }
            else {
                if (query.count) {
                    res.status(200).send(message.response("Ok", result.length));
                }
                else {
                    res.status(200).send(message.response("Ok", result));
                }
            }
            
        });
    });
}



const createUser = function(req, res) {
}


const getUser = function(req, res) {
    
}


const replaceUser = function(req, res) {
}



const deleteUser = function(req, res) {
}


exports.getUserList = getUserList;
exports.createUser = createUser;
exports.getUser = getUser;
exports.replaceUser = replaceUser;
exports.deleteUser = deleteUser;