// Load required packages
var mongoose = require('mongoose');

// Define our event schema
var EventSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true, unique : true},
    description: {type: String, required: true} ,
    datetime: { type: Date, required: true },
    link: {type: String, required: true} ,
    image: {type: String, required: true} ,
    category: {type: String, required: true} ,
    venues: {type: [String], required: true},
    
    // add more here
});

// Export the Mongoose model
var event = mongoose.model('Event', EventSchema);
module.exports.event = event;


