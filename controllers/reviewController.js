
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

        let reviews = db.collection("reviews").aggregate(query.aggregation);

        reviews.toArray(function(err, result) {
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
    const req_body = req.body;

    var user_id = req_body.user_id;
    

    if (!name) {
        res.status(400).send(message.response("Invalid", "Name field needs to be included"));
        return;
    }
    if (!email) {
        res.status(400).send(message.response("Invalid", "Email field needs to be included"));
        return;
    }

    mongoose.connect(secrets.mongo_connection, function(err, db) {
        if (err) {
            res.status(500).send(message.response("Invalid", "Server Error"));
            return;
        }

        try {
            db.collection("users").findOne( {
                email: email
            }).then((user) => {
                if (user) {
                    res.status(400).send(message.response(user._id, "Invalid - a different, existing user has the same email address"));
                    return;
                }
                else {
                    const user = new userModel.user({
                        name: name,
                        email: email,
                        pendingTasks: pendingTasks,
                        dateCreated: new Date()
                    });
                    
                    res.status(201).send(message.response(user._id, user));
                    user.save();
                }
            });

        }
        catch(err) {
            res.status(500).send(message.response("Invalid", "Server Error"));
        }
        
    });
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