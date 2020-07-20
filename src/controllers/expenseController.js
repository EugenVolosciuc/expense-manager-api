const { isEmpty } = require('lodash');
const dayjs = require('dayjs');

const { ErrorHandler } = require('../helpers/error');
const Expense = require('../models/Expense');
const Payment = require('../models/Payment');
const { PAYMENT_STATS } = require('../constants');

exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ user: req.user._id });

        if (isEmpty(expenses)) {
            throw new ErrorHandler(404, 'No expenses found');
        }

        res.status(200).send(expenses);
    } catch (error) {
        next(error);
    }
}

exports.getExpensesWithCurrentMonthPaymentStats = async (req, res, next) => {
    try {
        Promise.all(([
            Payment.find({
                user: req.user._id,
                paydate: {
                    $gte: dayjs().startOf('month').toDate(),
                    $lt: dayjs().endOf('month').toDate()
                }
            }).lean(),
            Expense.find({ user: req.user._id }).lean()
        ])).then(results => {
            const [payments, expenses] = results
            // TODO: Modify stats for bimonthly expenses

            if (isEmpty(expenses)) {
                throw new ErrorHandler(404, 'No expenses found');
            }

            const expensesDetails = expenses.map(expense => {
                const expenseDetails = expense;

                // Check if there is a payment for the expenses
                const paymentForExpense = !isEmpty(payments) && payments.find(payment => expense._id.equals(payment.expense))

                if (paymentForExpense) {
                    expenseDetails.paymentStatus = PAYMENT_STATS.PAYED;
                } else if (expense.remindDate >= dayjs().format('D')) {
                    expenseDetails.paymentStatus = PAYMENT_STATS.TO_BE_PAYED;
                } else {
                    expenseDetails.paymentStatus = PAYMENT_STATS.NOT_PAYED;
                }

                return expenseDetails;
            })

            res.status(200).send(expensesDetails);
        }).catch(error => {
            next(error);
        })
    } catch (error) {
        // console.log("ERROR!!!", error)
        next(error);
    }
}

exports.createExpense = async (req, res, next) => {
    try {
        const expense = new Expense({ ...req.body, user: req.user._id });

        await expense.save();
        res.status(201).send(expense);
    } catch (error) {
        next(error);
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        req.user.expenses = req.user.expenses.filter(expense => expense._id === req.params.id);

        const user = await req.user.save();
        res.status(200).send(user);
    } catch (error) {
        next(error);
    }
}