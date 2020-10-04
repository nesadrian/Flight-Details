const express = require('express');
const { getAllFlights, getAirportById, sortAirportsAsc, sortAirportsDsc } = require('./src/api');
const { getPageButtonsNums, getPage } = require('./src/helpers');
const app = express();
app.set('view engine', 'pug');
app.use(express.static('img'));

let flights = [];
(async () => {
    flights = await getAllFlights();
})()

app.get('/:page', async (req, res) => {
    let pageNum = +req.params.page;
    if(pageNum < 1) res.redirect('/1');

    const flightCount = flights.length;
    const perPage = 12;
    const pageCount = Math.ceil(flightCount / perPage);

    if(pageNum > pageCount) res.redirect('/' + pageCount);

    const page = getPage(flights, perPage, pageNum)
    const pageButtonNums = getPageButtonsNums(pageNum, pageCount);

    res.render('index', {
        title: 'All Flights',
        flightDetails: page,
        pageButtons: pageButtonNums,
        pageButtonsSelected: pageNum,
        pageButtonsPrev: pageNum > 1 ? pageNum - 1 : null,
        pageButtonsNext: pageNum < pageCount ? pageNum + 1 : null,
        pageButtonsFirst: pageNum > 4 ? 1 : null,
        pageButtonsLast: pageNum < pageCount - 3 ? pageCount : null
    });
});

app.get('/:id', async (req, res) => {
    let airportId = req.params.id.toString();
    const airport = getAirportById(airportId, flights);
    res.render('index', {
        title: `Flights To And From ${airport.name}`,
        flightDetails: flights,
    });
});

app.listen(3000, () => console.log('Listening port 3000'));
