const mongoose = require('mongoose');

const Expense = require('./Expense');

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    expense: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
        required: true
    },
    paydate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    details: {
        type: String
    }
});

const Payment = mongoose.model('Payment', paymentSchema, 'payment');

module.exports = Payment