// Load required packages
var mongoose = require('mongoose');

// Define our venue schema
var VenueSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true, unique : true},
    name: {type: String, required: true} ,
    location: { 
        longitude: {type: String, required: true},
        latitude: {type: String, required: true},
    } ,    
    events: {type: [String], required: true},
    reviews: {type: [String], required: true},
    rawReviewTotal: {type: Number, default: 0},     
});

// Export the Mongoose model
venue = mongoose.model('Venue', VenueSchema);
module.exports.venue = venue;


