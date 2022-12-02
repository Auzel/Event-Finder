// Load required packages
var mongoose = require('mongoose');

// Define our event schema
var EventSchema = new mongoose.Schema({
    name: {type: String, required: true}
    // add more here
});

// Export the Mongoose model
var event = mongoose.model('Event', EventSchema);
module.exports.event = event;


