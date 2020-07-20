// as seen on https://dev.to/nedsoft/central-error-handling-in-express-3aej

const { isEmpty } = require('lodash');

class ErrorHandler extends Error {
    constructor(statusCode, message, errorObject = {}) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.errorObject = isEmpty(errorObject) ? { statusCode, message } : errorObject;
    }
}

const handleError = (err, res) => {
    const { statusCode, message, errorObject } = err;
    if (typeof statusCode !== 'number') {
        return res.status(500).json({
            error: err
        })
    }

    return res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
        error: errorObject
    });
};

module.exports = {
    ErrorHandler,
    handleError 
}