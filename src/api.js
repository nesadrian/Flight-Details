const fetch = require('node-fetch');
const { calcCrow, removeQuotes, formatCity, getTimeFromDist, removeDuplicates, textToArrays, getAirportCode, validAirports } = require('./helpers');

const getAirportById = (id, airports) => airports.find(airport => airport.id === id);

const formatAirportData = data => {
    const airportData = textToArrays(data);
    return airportData.map(airport => ({
            "id": airport[0],
            "airport": removeQuotes(airport[1]),
            "city": formatCity(airport[11]),
            "country": removeQuotes(airport[3]),
            "code": getAirportCode(airport[4], airport[5]),
            "lat": airport[6],
            "lon": airport[7]
        })
    );
}

const formatRouteData = data => {
    const routeDataArrays = textToArrays(data);
    return routeDataArrays.map(routeData => ({
            "srcId": routeData[3],
            "dstId": routeData[5]
        })
    )
}

const getAirports = () => fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat')
    .then(data => data.text())
    .then(result => formatAirportData(result))

const getRoutes = () => fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat')
    .then(data => data.text())
    .then(result => formatRouteData(result))

const getAirportFlights = async (airportId) => {
    const airports = await getAirports();
    const routes = await getRoutes();
    const srcAirport = getAirportById(airportId.toString(), airports);
    let flights = [];
    routes.forEach(route => {
        if(srcAirport.id === route.srcId) {
            const dstAirport = getAirportById(route.dstId, airports);
            if(validAirports(srcAirport, dstAirport)) {
                const distance = calcCrow(+srcAirport.lat, +srcAirport.lon, +dstAirport.lat, +dstAirport.lon);
                const flightDetails = {
                    "srcAirport": srcAirport,
                    "dstAirport": dstAirport,
                    "dist": distance,
                    "time": getTimeFromDist(distance)
                }
                flights.push(flightDetails);
            }
        }
    })
    return flights;
}

const getTenLongDistFlights = async () => {
    const airports = await getAirports();
    const routes = await getRoutes();
    let flights = [];
    routes.forEach(route => {
        const srcAirport = getAirportById(route.srcId, airports);
        const dstAirport = getAirportById(route.dstId, airports);
        if(validAirports(srcAirport, dstAirport)) {
            const distance = calcCrow(+srcAirport.lat, +srcAirport.lon, +dstAirport.lat, +dstAirport.lon);
            const flightInfo = {
                "srcAirport": srcAirport,
                "dstAirport": dstAirport,
                "dist": distance,
                "time": getTimeFromDist(distance)
            }
            flights.push(flightInfo);
        }
    })
    let tenLongDistFlights = flights.sort((a, b) => b.dist - a.dist).slice(0, 25);
    tenLongDistFlights = removeDuplicates(tenLongDistFlights);
    return tenLongDistFlights;
}

module.exports = {
    getTenLongDistFlights,
    getAirportFlights
}
