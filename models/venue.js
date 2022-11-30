// Load required packages
var mongoose = require('mongoose');

// Define our venue schema
var VenueSchema = new mongoose.Schema({
    name: {type: String, required: true}
    // add more here
});

// Export the Mongoose model
venue = mongoose.model('Venue', VenueSchema);
module.exports.venue = venue;


