const express = require('express');
const { getTenLongDistFlights, getAirportFlights } = require('./src/api');
const app = express();
app.set('view engine', 'pug');
app.use(express.static('img'));

app.get('/', async (req, res) => {
    const tenLongDistFlights = await getTenLongDistFlights();
    res.render('index', {
        flightDetails: tenLongDistFlights,
    });
});

app.get('/:id', async (req, res) => {
    const airportFlights = await getAirportFlights(req.params.id);
    res.render('index', {
        flightDetails: airportFlights,
    });
});

app.listen(3000, () => console.log('Listening port 3000'));
