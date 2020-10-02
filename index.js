const express = require('express');
const { getLongFlightDetails, getRoutesFromAirport } = require('./api');
const app = express();
app.set('view engine', 'pug');
app.use(express.static('views'));

app.get('/', (req, res) => {
    getLongFlightDetails(flightDetails => {
        res.render('index', {
            flightDetails: flightDetails,
            fs: require('fs')
        });
    });
});

app.get('/:id', (req, res) => {
    getRoutesFromAirport(req.params.id, flightDetails => {
        res.render('index', {
            flightDetails: flightDetails,
            fs: require('fs')
        });
    })
});

app.listen(3000, () => console.log('Listening port 3000'));
