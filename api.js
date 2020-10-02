const fetch = require('node-fetch');
const { calcCrow, removeQuotes, formatCity, getTimeFromDist, removeDuplicates } = require('./helpers');

const textToArrays = text => {
    return text
    .toString()
    .split('\n')
    .filter(r => r !== '')
    .map(r => r.split(','));
}

const getAirportsData = data => {
    const airportDataArr = textToArrays(data);
    const airportDataJson = airportDataArr.map(airportData => {
        const iataIcao = airportData[4] !== '\\N' ? airportData[4] : airportData[5];
        return jsonData = {
            "id": airportData[0],
            "airport": removeQuotes(airportData[1]),
            "city": formatCity(airportData[11]),
            "country": removeQuotes(airportData[3]),
            "iataIcao": removeQuotes(iataIcao),
            "lat": airportData[6],
            "lon": airportData[7]
        }
    });
    return airportDataJson;
}

const getRoutesData = data => {
    const routeDataArrays = textToArrays(data);
    const routeDataJson = routeDataArrays.map(routeData => {
        return jsonData = {
            "srcId": routeData[3],
            "dstId": routeData[5]
        }
    });
    return routeDataJson;
}

const getAirports = (cb) => fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat')
    .then(data => data.text())
    .then(result => cb(getAirportsData(result)))

const getRoutes = (cb) => fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat')
    .then(data => data.text())
    .then(result => cb(getRoutesData(result)))

const getAirportById = (id, airports) => airports.find(airport => airport.id === id);

//const getRouteById = (id, routes) => routes.find(route => route.id === id);

const getRoutesFromAirport = (airportId, cb) => {
    const airport = getAirportById(airportId);
    getRoutes(routes => {
        let flights = [];
        routes.forEach(route => {
            if(airport.id === route.srcId) {
                const dstAirport = getAirportById(route.dstId);
                if(!isNaN(airport.lat) && !isNaN(airport.lon) && !isNaN(dstAirport.lat) && !isNaN(dstAirport.lon)) {
                    const distance = calcCrow(+airport.lat, +airport.lon, +dstAirport.lat, +dstAirport.lon);
                    const flightInfo = {
                        "srcAirport": airport,
                        "dstAirport": dstAirport,
                        "dist": distance,
                        "time": getTimeFromDist(distance)
                    }
                    flights.push(flightInfo);
                }
            }
        })
        cb(flights);
    })
}

const getLongFlightDetails = (cb) => {
    getAirports(airports => {
        getRoutes(routes => {
            let longDistFlights = [];
            routes.forEach(route => {
                const srcAirport = getAirportById(route.srcId, airports);
                const dstAirport = getAirportById(route.dstId, airports);
                if(srcAirport && dstAirport) {
                    if(!isNaN(srcAirport.lat) && !isNaN(srcAirport.lon) && !isNaN(dstAirport.lat) && !isNaN(dstAirport.lon)) {
                        const distance = calcCrow(+srcAirport.lat, +srcAirport.lon, +dstAirport.lat, +dstAirport.lon);
                        const flightInfo = {
                            "srcAirport": srcAirport,
                            "dstAirport": dstAirport,
                            "dist": distance,
                            "time": getTimeFromDist(distance)
                        }
                        longDistFlights.push(flightInfo);
                    }
                }
            })
            let tenLongDistFlights = longDistFlights.sort((a, b) => b.dist - a.dist).slice(0, 25);
            tenLongDistFlights = removeDuplicates(tenLongDistFlights);
            cb(tenLongDistFlights);
        })
    })
}

module.exports = {
    getLongFlightDetails,
    getRoutesFromAirport
}
