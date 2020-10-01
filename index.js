const express = require('express');
const { getLongFlightDetails } = require('./api');
const app = express();
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    getLongFlightDetails(flightDetails => {
        res.render('index', {
            flightDetails: flightDetails
        });
    });
});

app.listen(3000, () => console.log('Listening port 3000'));
