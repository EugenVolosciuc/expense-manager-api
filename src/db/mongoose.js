const mongoose = require('mongoose');

const { ErrorHandler } = require('../helpers/error');

try {
    mongoose.connect(process.env.ATLAS_CONNECTION_STRING, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
} catch (error) {
    throw new ErrorHandler(500, 'Could not connect to database', error);
}