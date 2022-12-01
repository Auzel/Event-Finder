var mongoose = require('mongoose');
var crypto = require('crypto');
const {v1: uuidv1} = require("uuid")
const uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true, dropDups: true},
    encryptedPassword: {type: String, required: true},
    email: {type: String, required: true, unique: true, dropDups: true},
    eventPrefs: {type: [String], required: true},
    plainPass: String
}, {timestamps: true});

UserSchema.virtual("password")
.set(function(password) {
    this.tempPassword = password;
    this.plainPass = uuidv1();
    this.encryptedPassword = this.encryptPassword(password);
})
.get(() => {
    return this.tempPassword;
});

UserSchema.methods = {
    authenticate: function(plainPassword) {return this.encryptPassword(plainPassword) === this.encryptedPassword;},
    encryptPassword: function(plainPassword) {
        if (!plainPassword) {
            return "";
        }

        try {
            return crypto.createHmac("sha256", this.plainPass).update(plainPassword).digest("hex");
        } catch (err) {
            console.log(err);
            return "";
        }
    }
}

UserSchema.plugin(uniqueValidator, {message: '{PATH} must be unique'});

module.exports = mongoose.model('User', UserSchema);