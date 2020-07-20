const { isEmpty } = require('lodash');

const { ErrorHandler } = require('../helpers/error');
const getFilterPeriod = require('../helpers/getFilterPeriod');
const Payment = require('../models/Payment');

exports.getPayments = async (req, res, next) => {
    try {
        let payments = {};

        if (req.query.filterBy) {
            const filterPeriod = getFilterPeriod(JSON.parse(req.query.filterBy).date);

            payments = await Payment.find({
                ...(req.query.expenseID && { expense: req.query.expenseID }),
                paydate: {
                    $gte: filterPeriod[0],
                    $lt: filterPeriod[1]
                }
            });
        } else {
            payments = await Payment.find({
                ...(req.query.expenseID && { expense: req.query.expenseID })
            });
        }

        if (isEmpty(payments)) {
            throw new ErrorHandler(404, `No payments found for the specified expense${req.query.filterBy ? ' and filters' : ''}`);
        }

        res.status(200).send(payments);
    } catch (error) {
        console.log("ERROR HAPPENED", error)
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