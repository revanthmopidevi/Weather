const request = require('postman-request')

const forecast = (data, callback) => {
    const url = "http://api.weatherstack.com/current?access_key=2dcdb5b88f4927da28683deb99eb16e0&query=" + `${data.latitude},${data.longitude}` + "&units=m"
    request({ url: url, json: true}, (error, response) => {
        if (error) {
            callback("Could not fetch data.", undefined)
        } else if (response.body.error) {
            callback("Unable to find location.", undefined)
        } else {
            callback(undefined, `It is currently ${response.body.current.temperature} with a rainfall of ${response.body.current.precip} cm.`)
        }
    })
}

module.exports = forecast