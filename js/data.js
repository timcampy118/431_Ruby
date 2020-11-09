var cache = null;
var dates = null;
var fipsCasesCache = new Map();

/**
 * This function fetch the data either from network or from cache if possible.
 */
function fetchData() {
    let networkFetch = Promise.all([
        d3.json("data/counties-10m.json"),
        d3.json("data/covid_cases.json"),
        d3.json("data/mobility_date_data.json"),
        d3.json("data/mobility_fips_data.json"),
    ]).then(data => {
        // console.log('Fetch from network');
        cache = data;
        
        return data;
    });

    var cacheFetch = new Promise(function (resolve, reject) {
        // get a resource from the Cache
        if (cache !== null) {
            // console.log('Fetch from cache');
            resolve(cache)
        }
    });

    return Promise.race([networkFetch, cacheFetch]);
}

function getCovidData(forDate) {
    if (covidCases.hasOwnProperty(forDate)) {
        return covidCases[forDate];
    }
    return null;
}

function covidCasesFor(fipsCode) {
    if (fipsCasesCache.has(fipsCode)) {
        // console.log("From cache");
        return fipsCasesCache.get(fipsCode);
    }

    if (dates == null) {
        // console.log("first date");
        initDates();
    }

    var res = {};
    dates.forEach(date => {
        const dateData = covidCases[date];
        // console.log("date " + dateData[fipsCode]);
        if (dateData.hasOwnProperty(fipsCode)) {
            res[date] = dateData[fipsCode];
        }
    })
      
    fipsCasesCache.set(fipsCode, res);
    return res;
}

function initDates() {
    dates = [];
    for (date in covidCases) {
        if (covidCases.hasOwnProperty(date)) {
            dates.push(date);
        }
    }
}

function getCovidDataForFipsCode(forDate, fipsCode) {
    const dateData = getCovidData(forDate);
    if (dateData === null) {
        return null;
    }

    if (dateData.hasOwnProperty(fipsCode)) {
        return dateData[fipsCode];
    }
    return null;
}

const categories = {
    retail: 0,
    grocery: 1,
    parks: 2,
    transit: 3,
    workplaces: 4,
    residential: 5
}

function getMobilityForFipsOnDate(fipsCode, date) {
    const fipsData = getMobilityDataForFips(fipsCode);
    if (fipsData != null && fipsData.hasOwnProperty(date)) {
        return fipsData[date];
    }
    return null;
}

function getMobilityData(forDate) {
    const dateMobilityData = cache[2];
    if (dateMobilityData.hasOwnProperty(forDate)) {
        return dateMobilityData[forDate];
    }
    return null;
}

// this is the constant to indicate that data for a categories is not available
// 0 is not a good idea here
const DATA_NOT_AVAILABLE = '-100000';

function getMobilityDataForFips(fipsCode) {
    const fipsMobilityData = cache[3];
    if (fipsMobilityData.hasOwnProperty(fipsCode)) {
        return fipsMobilityData[fipsCode];
    }
    return null;
}

