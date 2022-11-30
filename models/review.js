// Load required packages
var mongoose = require('mongoose');

// Define our review schema
var ReviewSchema = new mongoose.Schema({
    name: {type: String, required: true}
    // add more here
});

// Export the Mongoose model
review = mongoose.model('Review', ReviewSchema);
module.exports.review = review;


