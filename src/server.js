const express = require('express');
const app = express();
const cors = require('cors');

const errorHandler = require('./middleware/errorHandler');

// Config and DB
require('dotenv').config();
require('./db/mongoose');

const PORT = process.env.PORT || 3001;

// CORS and body parser
app.use(cors());
app.use(express.json());

// Router
app.use('/users', require('./routes/users'));
app.use('/expenses', require('./routes/expenses'));
app.use('/payments', require('./routes/payments'));

// Error handling
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));