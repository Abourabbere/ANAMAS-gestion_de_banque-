const express = require('express');
const morgan = require('morgan');
const generator = require('generate-serial-number');

const app = express();

// Routes
const userRoutes = require('./routes/user.routes')
const testRoutes = require('./routes/test.routes')

const port = 5000

// middleware
app.use(express.json());
app.use(morgan('tiny'));

// apis
app.use('/user', userRoutes)
app.use('/test', testRoutes)

app.listen(port, () => {
    console.log(' app running on localhost: ' + port);
})