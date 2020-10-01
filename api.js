const fetch = require('node-fetch');
const { calcCrow } = require('./helpers');

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
        return jsonData = {
            "id": airportData[0],
            "airport": airportData[1],
            "city": airportData[2],
            "country": airportData[3],
            "iata": airportData[4],
            "icao": airportData[5],
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
                            "dist": distance
                        }
                        longDistFlights.push(flightInfo);
                    }
                }
            })
            let tenLongDistFlights = longDistFlights.sort((a, b) => b.dist - a.dist).slice(0, 10);
            cb(tenLongDistFlights);
        })
    })
}

module.exports = {
    getRoutes,
    //getRouteById,
    getAirports,
    getAirportById,
    getLongFlightDetails
}
