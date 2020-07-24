const mongoose = require('mongoose');

const { EXPENSE_CATEGORIES } = require('../constants');

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    expense: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
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
        type: String,
        required: hasNoExpenseLinked
    },
    category: {
        type: String,
        required: true,
        enum: Object.values(EXPENSE_CATEGORIES),
        required: hasNoExpenseLinked
    },
});

function hasNoExpenseLinked() {
    if (this.expense) return true
    return false
}

const Payment = mongoose.model('Payment', paymentSchema, 'payment');

module.exports = Payment