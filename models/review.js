// Load required packages
var mongoose = require('mongoose');

// Define our review schema
var ReviewSchema = new mongoose.Schema({
    user_id: {type: String, requred: true},
    venue_id: {type: String, required: true},
    rating: {type: Number, required: true},
    short_comment: {type: String, required: false},
    long_comment: {type: String, required: false},
    eventAttendedName: {type: String, required: false},
    eventAttendedDate: {type: String, required: false},
});

// Export the Mongoose model
var review = mongoose.model('Review', ReviewSchema);
module.exports.review = review;


