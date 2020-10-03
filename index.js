const express = require('express');
const { getAllFlights, getAirportFlights, getAirportById, getAirports } = require('./src/api');
const app = express();
app.set('view engine', 'pug');
app.use(express.static('img'));

app.get('/:page', async (req, res) => {
    let pageNum = +req.params.page;
    if(pageNum < 1) res.redirect('/1');

    const flights = await getAllFlights();

    const flightCount = flights.length;
    const perPage = 12;
    const pageCount = Math.ceil(flightCount / perPage);

    if(pageNum > pageCount) res.redirect('/' + pageCount);

    let from = (pageNum - 1) * perPage;
    let to = from + perPage > flightCount ? flightCount : from + perPage;
    const page = flights.slice(from, to);

    // Too tired. Refactor at some point
    let pageNumbers = [];
    let i = pageNum - 3 >= 1 ? pageNum - 3 : 1;
    while(i < pageNum + 4) {
        if(i === pageCount) break;
        pageNumbers.push(i);
        i++;
    }

    res.render('index', {
        title: 'All Flights',
        flightDetails: page,
        pageButtons: pageNumbers,
        pageButtonsSelected: pageNum,
        pageButtonsPrev: pageNum > 1 ? pageNum - 1 : undefined,
        pageButtonsNext: pageNum < pageCount ? pageNum + 1 : undefined,
        pageButtonsFirst: pageNum > 3 ? 1 : undefined,
        pageButtonsLast: pageNum < pageCount - 3 ? pageCount : undefined
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
