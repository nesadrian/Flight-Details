const express = require('express');
const { getTenLongDistFlights, getAirportFlights, getAirportById, getAirports } = require('./src/api');
const app = express();
app.set('view engine', 'pug');
app.use(express.static('img'));

app.get('/', async (req, res) => {
    const tenLongDistFlights = await getTenLongDistFlights();
    res.render('index', {
        title: 'Ten Longest Distance Flights',
        flightDetails: tenLongDistFlights,
    });
});

app.get('/:id', async (req, res) => {
    let airportId = req.params.id.toString();
    const airport = getAirportById(airportId, await getAirports());
    const airportFlights = await getAirportFlights(airportId);
    res.render('index', {
        title: `Flights To And From ${airport.name}`,
        flightDetails: airportFlights,
    });
});

app.listen(3000, () => console.log('Listening port 3000'));
