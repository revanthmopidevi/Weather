const request = require('postman-request')

const geocode = (address, callback) => {
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=pk.eyJ1IjoicmV2YW50aG1vcGlkZXZpIiwiYSI6ImNra3IyZnA4ZDAwcXgyb3BiZWlwdW11dm4ifQ.72Ub9Qutx0ohWDlqHhxyoQ&endpoint=mapbox.places&search_text=" + encodeURIComponent(address) + "&limit=1"
    request({ url: url, json: true}, (error, response) => {
        if (error) {
            callback("Unable to fetch data.", undefined)
        } else if (response.body.features.length === 0) {
            callback("Unable to find location.", undefined)
        } else {
            const data = {
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            }
            callback(undefined, data)
        }
    })
}

module.exports = geocode