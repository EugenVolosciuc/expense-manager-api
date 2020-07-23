const { isEmpty } = require('lodash');

const { ErrorHandler } = require('../helpers/error');
const getFilterPeriod = require('../helpers/getFilterPeriod');
const Payment = require('../models/Payment');

exports.getPayments = async (req, res, next) => {
    try {
        let payments = {};
        let filterPeriod;

        if (req.query.filterBy) {
            filterPeriod = getFilterPeriod(JSON.parse(req.query.filterBy).date);
        }

        const options = {
            ...(req.query.expenseID && { expense: req.query.expenseID }),
            ...(req.query.filterBy && {
                paydate: {
                    $gte: filterPeriod[0],
                    $lt: filterPeriod[1]
                }
            })
        }

        payments = await Payment.find(options).populate('expense').lean();

        if (isEmpty(payments)) {
            throw new ErrorHandler(404, `No payments found for the specified expense${req.query.filterBy ? ' and filters' : ''}`);
        }

        if (req.query.withTotal) {
            payments = {
                payments,
                total: payments.reduce((total, payment) => total + payment.amount, 0)
            }
        }

        res.status(200).send(payments);
    } catch (error) {
        next(error);
    }
}

exports.createPayment = async (req, res, next) => {
    try {
        const payment = new Payment({ ...req.body, user: req.user._id });

        await payment.save();
        res.status(201).send(payment);
    } catch (error) {
        next(error);
    }
}