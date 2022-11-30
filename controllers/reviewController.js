
var secrets = require('../config/secrets');
var mongoose = require('mongoose');

var queryController = require('./queryController');
var message = require('../models/message');


const getReviewList = function(req, res) {
    var query = new queryController.Query(req.query);

    mongoose.connect(secrets.mongo_connection, function(err, db) {
        if (err) {
            res.status(500).send(message.response("Invalid", "Server Error"));
            return;
        }

        let users = db.collection("reviews").aggregate(query.aggregation);

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



const createReview = function(req, res) {
}

const getReview = function(req, res) {
}


const replaceReview = function(req, res) {
}



const deleteReview = function(req, res) {
}


exports.getReviewList = getReviewList;
exports.createReview = createReview;
exports.getReview = getReview;
exports.replaceReview = replaceReview;
exports.deleteReview = deleteReview;