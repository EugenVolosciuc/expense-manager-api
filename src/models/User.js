const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ExpenseSchema = require('../models/Expense').schema;
const { ErrorHandler } = require('../helpers/error');
const { CURRENCIES } = require('../constants')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new ErrorHandler(400, 'Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate: value => {
            if (value == 'password') {
                throw new ErrorHandler(400, 'Password cannot be password');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    currency: {
        type: String,
        required: true,
        enum: Object.keys(CURRENCIES)
    }
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '2 days'});

    user.tokens = user.tokens.concat({ token });

    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ErrorHandler(400, 'Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ErrorHandler(400, 'Unable to login');
    }

    return user;
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;