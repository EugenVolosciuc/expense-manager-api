const { isArray } = require('lodash');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

const { ErrorHandler } = require('./error');

dayjs.extend(customParseFormat);

function getFilterPeriod(date) {
    if (isArray(date)) {
        if (date.length != 2) {
            throw new ErrorHandler(400, 'The provided date attribute\'s format is incorrect');
        }

        const firstDaySplit = date[0].split('-')
        const secondDaySplit = date[1].split('-')

        if (firstDaySplit.length != secondDaySplit.length) {
            throw new ErrorHandler(400, 'The dates provided are different. Make sure their format is the same.');
        }

        switch (firstDaySplit.length) {
            case 1: // year 
                return [
                    dayjs(date[0], 'YYYY').startOf('year').toDate(),
                    dayjs(date[1], 'YYYY').endOf('year').toDate()
                ];
            case 2: // year-month
                return [
                    dayjs(date[0], 'YYYY-MM').startOf('month').toDate(),
                    dayjs(date[1], 'YYYY-MM').endOf('month').toDate()
                ];
            case 3: // year-month-day
                return [
                    dayjs(date[0], 'YYYY-MM-DD').startOf('day').toDate(),
                    dayjs(date[1], 'YYYY-MM-DD').endOf('day').toDate()
                ];
        }
    } else {
        const splitDate = date.split('-');
        switch (splitDate.length) {
            case 1: // year 
                return [
                    dayjs(date, 'YYYY').toDate(),
                    dayjs(date, 'YYYY').add(1, 'y').toDate()
                ];
            case 2: // year-month
                return [
                    dayjs(date, 'YYYY-MM').toDate(),
                    dayjs(date, 'YYYY-MM').add(1, 'M').toDate()
                ];
            case 3: // year-month-day
                return [
                    dayjs(date, 'YYYY-MM-DD').toDate(),
                    dayjs(date, 'YYYY-MM-DD').add(1, 'd').toDate()
                ];
        }
    }
}

module.exports = getFilterPeriod