
var secrets = require('../config/secrets');
var mongoose = require('mongoose');

var queryController = require('./queryController');
var message = require('../models/message');


const getEventList = function(req, res) {
    var query = new queryController.Query(req.query);

    mongoose.connect(secrets.mongo_connection, function(err, db) {
        if (err) {
            res.status(500).send(message.response("Invalid", "Server Error"));
            return;
        }

        let users = db.collection("events").aggregate(query.aggregation);

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



const getEvent = function(req, res) {
}




exports.getEventList = getEventList;
exports.getEvent = getEvent;