const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email Already exists',
        match: [/.+\@.+\..+/, 'Please fill valid email address'],
        required: 'Email is required'
    },
    created: {
        type: Date,
        default: Date.now()
    },
    updated: Date,
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    salt: String,
    about: {
        type: String,
        trim: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    educator: {
        type: Boolean,
        default: false
    }
});

userSchema.methods = {
    authenticate: function (plainText) {
        const value = this.encryptPassword(plainText) === this.hashed_password;
        if (value) console.log("authenticated successfully");
        return value;
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            const hash = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            return hash;
        } catch (err) {
            return '';
        }
    },
    makeSalt: function () {
        return Math.round((new Date().valueOf()) * Math.random()) + '';
    }
};

userSchema.virtual('password').set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function () { return this._password });


module.exports = mongoose.model('User', userSchema);