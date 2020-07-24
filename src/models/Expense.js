const mongoose = require('mongoose');
const validator = require('validator');
const { EXPENSE_CATEGORIES } = require('../constants');

const EXPENSE_TYPES = ['MONTHLY', 'BIMONTHLY'];

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: Object.keys(EXPENSE_CATEGORIES)
    },
    type: {
        type: String,
        required: true,
        enum: EXPENSE_TYPES
    },
    recurrent: {
        type: Boolean,
        required: true
    },
    amount: {
        type: Number,
        required: isRecurrent
    },
    payday: {
        type: Number,
        min: 1,
        max: 31,
        required: isRecurrent
    },
    remindDate: {
        type: Number,
        min: 1,
        max: 31
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

function isRecurrent() {
    if (this.recurrent) return true
    return false
}

const Expense = mongoose.model('Expense', expenseSchema, 'expense');

module.exports = Expense;