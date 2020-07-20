const { handleError } = require('../helpers/error');

const errorHandler = (err, req, res, next) => {
    handleError(err, res);
}

module.exports = errorHandler