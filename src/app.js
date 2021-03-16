const express = require('express')
const path = require('path')
const hbs = require('hbs')
const Saml2js = require('saml2js')
const session = require('express-session')
const { traceDeprecation } = require('process')
// custom imported modules
const passport = require('./utils/passport')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const isAuthenticated = require('./utils/auth')

const app = express()
const port = process.env.PORT || 3000

app.use(session({secret: 'Newuser@123'}))
app.use(passport.initialize())
app.use(passport.session())

// define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsDirPath = path.join(__dirname, "../templates/views")
const partialsDirPath = path.join(__dirname, "../templates/partials")

// setup handlebar engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsDirPath)
hbs.registerPartials(partialsDirPath)

// setup static directory location
app.use(express.static(publicDirPath))

app.get('/login/', 
    passport.authenticate('saml', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
)

app.post('/login/callback',
    passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
        const xmlResponse = req.body.SAMLResponse
        const parser = new Saml2js(xmlResponse)
        req.samlUserObject = parser.toObject()
        console.log(samlUserObject) // TESTING
        next();
    },
)

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
}
)

app.get('/', isAuthenticated,(req, res) => {
    res.render('index', {
        title: "Weather App",
        name: "Revanth"
    })
})

app.get('/help', isAuthenticated,(req, res) => {
    res.render('help', {
        title: "Help",
        name: "Revanth"
    })
})

app.get('/weather', isAuthenticated,(req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "Address not provided."
        })
    }
    geocode(req.query.address, (error, geodata) => {
        if (error) {
            return res.send({
                error: "Could not geo-code location."
            })
        }
        forecast(geodata, (error, data) => {
            if (error) {
                return res.send({
                    error: "Could not fetch weather data."
                })
            }
            res.send({
                forecast: data,
                location: geodata.location,
                address: req.query.address
            })
        })
    })
})

app.get('*', isAuthenticated,(req, res) => {
    res.render('404', {
        title: "Weather App",
        name: "Revanth"
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})