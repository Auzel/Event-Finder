
var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var reviewModel = require("../models/review")

var message = require('../models/message');
const jsonwebtoken = require('jsonwebtoken');
const { QueryBuilder } = require('@mui/icons-material');


const getReviewList = function(req, res) {
    
    try {
        if (!verifyToken(req)) {
            return res.status(401).json(message.response("Unauthorized", {})); 
        }

        var query = [];
        var count = false;
        var limit = 10;

        if (req.query.limit) {
            limit = req.query.limit
        }
        query.push({$limit: limit});
        
        console.log(req.query.venue_id)
        if (req.query.venue_id) {
            query.push({$match: {venue_id: req.query.venue_id}});
        }
        if (req.query.count) {
            count = true;
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


const createReview = function(req, res) {
    try {
        if (!verifyToken(req)) {
            return res.status(401).json(message.response("Unauthorized", {})); 
        }

        var user_id = req.body._id;
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

            var aggregate = {};
            aggregate.user_id = user_id;
            aggregate.venue_id = venue_id;

            var final_rating = 0

            if (req.body.rating != null && !Number.isNaN(req.body.rating) && req.body.rating >= 0 && req.body.rating <= 5) {
                aggregate.rating = parseInt(req.body.rating);
                final_rating = parseInt(req.body.rating)
            }
            if (req.body.short_comment) {
                aggregate.short_comment = req.body.short_comment;
            }
            if (req.body.long_comment) {
                aggregate.long_comment = req.body.long_comment;
            }
            if (req.body.eventAttendedName) {
                aggregate.eventAttendedName = req.body.eventAttendedName;
            }
            if (req.body.eventAttendedDate) {
                aggregate.eventAttendedDate = req.body.eventAttendedDate;
            }

            const finalReview = new reviewModel.review(aggregate);
            console.log(finalReview);

            finalReview.save().then((response) => {
                console.log("Made it here");
                db.collection("users").updateOne(
                    { _id : mongoose.Types.ObjectId(user_id)},
                    {
                        $push: {reviews: finalReview._id}
                    }
                ).then((response) => {
                    console.log("Made it here2");

                    var update_json = {};
                    user = db.collection("venues").findOne(
                        { venue_id: venue_id }
                    )
                    .then((venue) => {
                        console.log(venue);
                        if (venue) {
                            db.collection("venues").updateOne(
                                { venue_id : venue_id},
                                {
                                    $inc: {rawReviewTotal: final_rating, numberOfReviews: 1},
                                    $push: {reviews: mongoose.Types.ObjectId(finalReview._id)}
                                }
                            )
                        }
                        else {
                            console.log("Made it here");
                            db.collection("venues").insertOne(
                                {
                                    venue_id: venue_id,
                                    rawReviewTotal: final_rating, 
                                    numberOfReviews: 1,
                                    reviews: [mongoose.Types.ObjectId(finalReview._id)]
                                }
                            )
                        }

                        console.log("worked")
                        res.status(201).send(message.response(finalReview._id, finalReview));
                    
                    });
                    
                }).catch(() => {
                    console.log("unable to add to reviews array in users");
                    res.status(500).send(message.response(finalReview._id, {}));
                })
            }).catch((error) => {
                console.log("error");
                res.status(500).send(message.response(finalReview._id, {}));
            });
                   
        });

        
    } catch (err) {
        return res.status(500).json(message.response("Create Review Failed", {}));
    }

}


const getReview = function(req, res) {
    const { id } = req.params;
    console.log("getting with id:", id);
    var select = {}
    if (req.query.select != null) {
        select = JSON.parse(req.query.select);
    }

    try {
        if (!verifyToken(req)) {
            return res.status(401).json(message.response("Unauthorized", {})); 
        }

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
                if (review) {
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


const replaceReview = function(req, res) {
    const { id } = req.params;


    try {
        if (!verifyToken(req)) {
            return res.status(401).json(message.response("Unauthorized", {})); 
        }

        mongoose.connect(secrets.mongo_connection, function(err, db) {
            if (err) {
                res.status(500).send(message.response("Invalid - Server Error", {}));
                return;
            }

            var new_object = {};
            if (req.body._id) {
                new_object.user_id = req.body._id;
            }
            if (req.venue_id) {
                new_object.venue_id = req.body.venue_id;
            }
            if (req.body.rating && !Number.isNaN(req.body.rating) && req.body.rating >= 0 && req.body.rating <= 5) {
                new_object.rating = parseInt(req.body.rating)
            }
            if (req.body.rating && !Number.isNaN(req.body.rating) && req.body.rating >= 0 && req.body.rating <= 5) {
                new_object.rating = parseInt(req.body.rating);
            }
            if (req.body.short_comment) {
                new_object.short_comment = req.body.short_comment;
            }
            if (req.body.long_comment) {
                new_object.long_comment = req.body.long_comment;
            }
            if (req.body.eventAttendedName) {
                new_object.eventAttendedName = req.body.eventAttendedName;
            }
            if (req.body.eventAttendedDate) {
                new_object.eventAttendedDate = req.body.eventAttendedDate;
            }

            db.collection("reviews").update( 
                {_id: mongoose.Types.ObjectId(id)},
                { $set: new_object }
            ).then(() => {
                res.status(200).send(message.response("Success", "Sucessfully updated review"));
            }).catch(() => {
                return res.status(500).json(message.response("Update Review Failed", {}));
            })
                
        });



    } catch (err) {
        return res.status(500).json(message.response("Update Review Failed", {}));
    }


}



const deleteReview = function(req, res) {
    const { id } = req.params;
    const user_id = req.body.user_id;
    
    try {
        if (!verifyToken(req)) {
            return res.status(401).json(message.response("Unauthorized", {})); 
        }

        mongoose.connect(secrets.mongo_connection, function(err, db) {
            if (err) {
                res.status(500).send(message.response("Invalid - Server Error", {}));
                return;
            }
                
            db.collection("reviews").findOne( {
                _id: mongoose.Types.ObjectId(id)
            }).then((foundReview) => {
                if (foundReview) {
                    db.collection("users").updateOne(
                        { user_id : mongoose.Types.ObjectId(user_id)},
                        {
                            $pull: {reviews: mongoose.Types.ObjectId(id)}
                        }
                    ).then(() => {
                        db.collection("reviews").deleteOne( {
                            _id: mongoose.Types.ObjectId(id)
                        }).then(() => {
                            db.collection("venues").updateOne(
                                { reviews : {$elemMatch : {$eq: mongoose.Types.ObjectId(id)}}},
                                {
                                    $inc: {rawReviewTotal: -1 * final_rating, numberOfReviews: -1},
                                    $pull: {reviews: mongoose.Types.ObjectId(id)}
                                }
                            ).then(() => {
                                res.status(200).send(message.response(id, "Successfully deleted"));
                            }).catch(()=> {console.log("failed to delete review from venues table")});

                        }).catch(() => {
                            console.log("unable to delete review from review table");
                            res.status(500).send(message.response(id, {}));
                        });
                        
                    }).catch(() => {
                        console.log("unable to delete review from users table");
                        res.status(500).send(message.response(id, {}));
                    });
    
                }
                else {
                    console.log("review not found");
                    res.status(404).send(message.response(id, "review not found"));
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