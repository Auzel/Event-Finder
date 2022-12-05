
var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var reviewModel = require("../models/review")

var message = require('../models/message');
const jsonwebtoken = require('jsonwebtoken');


// done
const getReviewList = function(req, res) {
    
    try {
        jsonwebtoken.verify(req.cookies.token, secrets.jwt_sign_phrase, (err, decoded) => {
            if (err) {
                return res.status(401).json(message.response("Unauthorized", {}));
            }
            req.body._id = decoded._id;
        });

        var query = {};
        var count = false;
        if (req.query.venue_id) {
            query.venue_id = venue_id;
        }
        if (req.query.count) {
            query.count = true;
        }

        mongoose.connect(secrets.mongo_connection, function(err, db) {
            if (err) {
                res.status(500).send(message.response("Invalid", "Server Error"));
                return;
            }

            let reviews = db.collection("reviews").aggregate(query);

            reviews.toArray(function(err, result) {
                if (err) {
                    res.status(500).send(message.response("Invalid", "Server Error"));
                }
                else {
                    if (count) {
                        res.status(200).send(message.response("Ok", result.length));
                    }
                    else {
                        res.status(200).send(message.response("Ok", result));
                    }
                }
                
            });
        });

        
    } catch (err) {
        return res.status(500).json(message.response("Get Reviews Failed", {}));
    }

    
}


// done
const createReview = function(req, res) {
    try {
        jsonwebtoken.verify(req.cookies.token, secrets.jwt_sign_phrase, (err, decoded) => {
            if (err) {
                return res.status(401).json(message.response("Unauthorized", {}));
            }
            req.body._id = decoded._id;
        });

        var user_id = req.body.user_id;
        var venue_id = req.body.venue_id;

        if (!user_id) {
            res.status(400).send(message.response("Invalid - User ID field needs to be included", {}));
            return;
        }
        if (!venue_id) {
            res.status(400).send(message.response("Invalid - Venue ID field needs to be included", {}));
            return;
        }

        mongoose.connect(secrets.mongo_connection, function(err, db) {
            if (err) {
                res.status(500).send(message.response("Invalid", "Server Error"));
                return;
            }

            db.collection("reviews").findOne( {
                user_id: user_id,
                venue_id: venue_id
            }).then((review) => {
                if (review) {
                    res.status(400).send(message.response("Invalid - user has already submitted a review for the venue", {}));
                    return;
                }
                else {
                    var aggregate = {user_id: user_id, venue_id: venue_id}
                    if (req.body.rating != null && !Number.isNaN(req.body.rating) && req.body.rating >= 0 && req.body.rating <= 5) {
                        aggregate.rating = parseInt(rating)
                    }
                    if (req.body.rating != null && !Number.isNaN(req.body.rating) && req.body.rating >= 0 && req.body.rating <= 5) {
                        aggregate.rating = parseInt(rating);
                    }
                    if (req.bodyshort_comment) {
                        aggregate.short_comment = req.bodyshort_comment;
                    }
                    if (req.bodylong_comment) {
                        aggregate.long_comment = req.bodylong_comment;
                    }
                    if (req.bodyeventAttendedName) {
                        aggregate.eventAttendedDate = req.bodyeventAttendedDate;
                    }
                    if (req.bodyeventAttendedDate) {
                        aggregate.eventAttendedDate = req.bodyeventAttendedDate;
                    }

                    const review = new reviewModel.user(aggregate);
                    review.save();

                    db.collection("history").updateOne(
                        { user_id : mongoose.Types.ObjectId(user_id)},
                        {
                            $push: {venuesReviewed: mongoose.Types.ObjectId(review._id)}
                        }
                    );
                    
                    res.status(201).send(message.response(review._id, review));
                }
            });

        });

        
    } catch (err) {
        return res.status(500).json(message.response("Create Review Failed", {}));
    }

}


// done
const getReview = function(req, res) {
    const { id } = req.params;
    var select = {}
    if (req.query.select != null) {
        select = JSON.parse(req.query.select);
    }

    try {
        jsonwebtoken.verify(req.cookies.token, secrets.jwt_sign_phrase, (err, decoded) => {
            if (err) {
                return res.status(401).json(message.response("Unauthorized", {}));
            }
            req.body._id = decoded._id;
        });


        mongoose.connect(secrets.mongo_connection, function(err, db) {
            if (err) {
                res.status(500).send(message.response("Invalid - server error", {}));
                return;
            }
    
            user = db.collection("reviews").findOne(
                {
                    _id: mongoose.Types.ObjectId(id)
                },
                {
                    projection: select
                }
            )
            .then((review) => {
                if (task) {
                    res.send(message.response(200, review));
                }
                else {
                    res.send(message.response(404, "Review with id:" + id + " not found"));
                }
            });
            
        });


    } catch (err) {
        return res.status(500).json(message.response("Get Review Failed", {}));
    }

}


// done
const replaceReview = function(req, res) {
    const { id } = req.params;


    try {
        jsonwebtoken.verify(req.cookies.token, secrets.jwt_sign_phrase, (err, decoded) => {
            if (err) {
                return res.status(401).json(message.response("Unauthorized", {}));
            }
            req.body._id = decoded._id;
        });


        var user_id = req.body.user_id;
        var venue_id = req.body.venue_id;

        if (!user_id) {
            res.status(400).send(message.response("Invalid - User ID field needs to be included", {}));
            return;
        }
        if (!venue_id) {
            res.status(400).send(message.response("Invalid - Venue ID field needs to be included", {}));
            return;
        }

        mongoose.connect(secrets.mongo_connection, function(err, db) {
            if (err) {
                res.status(500).send(message.response("Invalid - Server Error", {}));
                return;
            }

            var new_object = {user_id: user_id, venue_id: venue_id};
            if (req.body.rating && !Number.isNaN(req.body.rating) && req.body.rating >= 0 && req.body.rating <= 5) {
                aggregate.rating = parseInt(rating)
            }
            if (req.body.rating && !Number.isNaN(req.body.rating) && req.body.rating >= 0 && req.body.rating <= 5) {
                aggregate.rating = parseInt(rating);
            }
            if (req.bodyshort_comment) {
                aggregate.short_comment = req.bodyshort_comment;
            }
            if (req.bodylong_comment) {
                aggregate.long_comment = req.bodylong_comment;
            }
            if (req.bodyeventAttendedName) {
                aggregate.eventAttendedDate = req.bodyeventAttendedDate;
            }
            if (req.bodyeventAttendedDate) {
                aggregate.eventAttendedDate = req.bodyeventAttendedDate;
            }

            db.collection("reviews").update( 
                {_id: mongoose.Types.ObjectId(id)},
                { $set: new_object }
            );

            res.status(200).send(message.response("Success", "Sucessfully updated review"));
                
        });



    } catch (err) {
        return res.status(500).json(message.response("Update Review Failed", {}));
    }


}



// Done
const deleteReview = function(req, res) {
    const { user_id, review_id } = req.params;


    try {
        jsonwebtoken.verify(req.cookies.token, secrets.jwt_sign_phrase, (err, decoded) => {
            if (err) {
                return res.status(401).json(message.response("Unauthorized", {}));
            }
            req.body._id = decoded._id;
        });


        mongoose.connect(secrets.mongo_connection, function(err, db) {
            if (err) {
                res.status(500).send(message.response("Invalid - Server Error", {}));
                return;
            }
                
            db.collection("reviews").findOne( {
                _id: mongoose.Types.ObjectId(review_id)
            }).then((foundReview) => {
                if (foundReview) {
                    db.collection("history").updateOne(
                        { user_id : mongoose.Types.ObjectId(user_id)},
                        {
                            $pull: {venuesReviewed: mongoose.Types.ObjectId(review_id)}
                        }
                    );
    
                    db.collection("reviews").deleteOne( {
                        _id: mongoose.Types.ObjectId(review_id)
                    });
                    res.status(200).send(message.response(id, "Successfully deleted"));
                }
                else {
                    res.status(404).send(message.response(id, "User not found"));
                }
            });
        });


    } catch (err) {
        return res.status(500).json(message.response("Delete Review Failed", {}));
    }
    
}





exports.getReviewList = getReviewList;
exports.createReview = createReview;
exports.getReview = getReview;
exports.replaceReview = replaceReview;
exports.deleteReview = deleteReview;