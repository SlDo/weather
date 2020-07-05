const rp = require('request-promise');
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
     *
     * @returns {*|PromiseLike<any>|Promise<any>}
     */

    this.getWeather = function (filter) {
        let options = {
            uri: `https://api.openweathermap.org/data/2.5/weather?${querystring.stringify(filter)}&appid=${config.api}&lang=${config.lang}&units=${config.units}`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };

        return rp(options).then(data => data)
    }
}
