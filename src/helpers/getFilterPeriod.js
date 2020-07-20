const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

function getFilterPeriod(date) {
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

module.exports = getFilterPeriod