const express = require('express');
const router = new express.Router();

const auth = require('../middleware/auth');
const { createExpense, getExpenses, getExpensesWithCurrentMonthPaymentStats, deleteExpense } = require('../controllers/expenseController');

// @desc    Get expenses
// @route   GET /expenses
router.get('/', auth, getExpenses);

// @desc    Get expenses with current month payment stats
// @route   GET /expenses/stats
router.get('/stats', auth, getExpensesWithCurrentMonthPaymentStats);

// @desc    Create expense
// @route   POST /expenses
router.post('/', auth, createExpense);

// @desc    Delete expense
// @route   Delete /expenses/:id
router.delete('/:id', auth, deleteExpense);

module.exports = router