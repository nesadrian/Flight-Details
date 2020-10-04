const toRad = (value) => {
    return value * Math.PI / 180;
};

const calcCrow = (lat1, lon1, lat2, lon2) => {
    var R = 6371
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d.toFixed(0);
};

const removeQuotes = str => str.replace(/"/g, '')

const formatCity = timeZone => removeQuotes(timeZone).replace(/(?=\/).*/, '').replace('_', ' ');

const getTimeFromDist = distance => {
    const time = distance / 926
    const hours = Math.trunc(time);
    const minutes = (((time - Math.floor(time)) / 60) * 1000).toFixed(0);
    return `${hours} h ${minutes} m`
}

const removeDuplicates = (route) => {
    return route.slice(0, 100)
        .filter((route, index, self) => index === self
        .findIndex((t) => (t.dist === route.dist)))
}

const textToArrays = text => {
    return text
    .toString()
    .split('\n')
    .filter(r => r !== '')
    .map(r => r.split(','));
}

const getAirportCode = (iata, icao) => {
    if (iata !== '\\N') return removeQuotes(iata);
    else if (icao !== '\\N') return removeQuotes(icao);
    else return '----';
}

const validAirports = (srcAirport, dstAirport) => {
    if(srcAirport && dstAirport) {
        return !isNaN(srcAirport.lat) && !isNaN(srcAirport.lon) && !isNaN(dstAirport.lat) && !isNaN(dstAirport.lon)
    } else {
        return false;
    }
}

const getPageButtonsNums = (pageNum, pageCount) => {
    let pageNumbers = [];
    let i = pageNum - 3 >= 1 ? pageNum - 3 : 1;
    if(pageNum > 5 && pageNum > pageCount - 3) i = pageCount - 6
    let end = (pageNum < 5 && pageNum < pageCount - 3) ? 8 : pageNum + 4;
    while(i < end) {
        if(i > pageCount) break;
        pageNumbers.push(i);
        i++;
    }
    return pageNumbers;
}

const getPage = (flights, perPage, pageNum) => {
    const flightCount = flights.length;
    let from = (pageNum - 1) * perPage;
    let to = from + perPage > flightCount ? flightCount : from + perPage;
    return flights.slice(from, to);
}

module.exports = {
    calcCrow,
    removeQuotes,
    formatCity,
    getTimeFromDist,
    removeDuplicates,
    textToArrays,
    getAirportCode,
    validAirports,
    getPageButtonsNums,
    getPage
}
