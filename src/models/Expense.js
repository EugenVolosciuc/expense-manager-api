const mongoose = require('mongoose');
const validator = require('validator');

const expenseTypes = ['MONTHLY', 'BIMONTHLY'];

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: expenseTypes
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