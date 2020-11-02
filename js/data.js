var cache = null;

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
    
    var cacheFetch = new Promise(function(resolve, reject) {
        // get a resource from the Cache
        if (cache !== null) {
            // console.log('Fetch from cache');
            resolve(cache)
        }
    });

    return Promise.race([networkFetch, cacheFetch]);
}