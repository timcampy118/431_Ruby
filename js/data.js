var cache = null;
var dates = null;
var fipsCasesCache = new Map();
/**
 * This function fetch the data either from network or from cache if possible.
 */
function fetchData() {
    let networkFetch = Promise.all([
        d3.json("data/counties-10m.json"),
        d3.json("data/covid_cases.json")
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