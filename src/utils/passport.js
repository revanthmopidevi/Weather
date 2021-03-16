const path = require('path')
const passport = require('passport')
const passportSaml = require('passport-saml')

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user);
})

// SAML strategy for passport -- Single IPD
const strategy = new passportSaml.Strategy(
  {
    path: '/login/callback',
    entryPoint: '',
    issuer: process.env.SSO_ISSUER,
    // callbackUrl: 'http://localhost:3000',
    cert: path.join(__dirname, '../../resources/duoCert.xml'),
  },
  (profile, done) => done(null, profile)
)

passport.use(strategy)

module.exports = passport