const https = require('https');
const querystring = require('querystring');

/**
 *
 * @param config
 *
 * @config.api - API key for your app
 * @config.lang - The language of the response
 * @config.full - Get full weather information
 * @config.units - Weather units (Celsius, Fahrenheit, etc)
 */

module.exports = function Weather(config) {

    /**
     *
     * @param filter
     *
     * @param.q - Search by city name
     * @param.id - Search by city id
     * @param.lon - One of the search parameters by geographical position. Longitude
     * @param.lat - One of the search parameters by geographical position. Latitude
     */

    this.getWeather = function (filter) {
        https.get(`https://api.openweathermap.org/data/2.5/weather?${querystring.stringify(filter)}&appid=${config.api}&lang=${config.lang}&units=${config.units}`, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                // Consume response data to free up memory
                res.resume();
                return error.message;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    if(config.full) parsedData
                        else return { temp: parsedData.main.temp, id: parsedData.id, name: parsedData.name };
                } catch (e) {
                    return e.message;
                }
            });
        })
    }
}
