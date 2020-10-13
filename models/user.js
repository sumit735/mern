const mongoose = require('mongoose');
const crypto = require('crypto');
const {
    v1: uuidv1
} = require('uuid');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userInfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

userSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.encry_password = this.securedPassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    authenticate: function (plainPwd) {
        return this.securedPassword(plainPwd) === this.encry_password;
    },

    securedPassword: function (plainPwd) {
        if (!plainPwd) return '';

        try {
            return crypto.createHmac('sha256', this.salt).update(plainPwd).digest('hex');
        } catch (e) {
            return '';
        }
    }
};

module.exports = mongoose.model('User', userSchema);