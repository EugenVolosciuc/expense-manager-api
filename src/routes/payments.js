const express = require('express');

const auth = require('../middleware/auth');
const { getPayments, createPayment } = require('../controllers/paymentController');

const router = new express.Router();

// @desc    Get payments
// @route   GET /payments
router.get('/', auth, getPayments);

// @desc    Create payment
// @route   POST /payments
router.post('/', auth, createPayment);

module.exports = router;