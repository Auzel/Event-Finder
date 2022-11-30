// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true}
    // add more here
});

// Export the Mongoose model
user = mongoose.model('User', UserSchema);
module.exports.user = user;


