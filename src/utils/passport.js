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
      entryPoint: 'https://sso-277d8abb.sso.duosecurity.com/saml2/idp/RI8UPKP9T5WBYKXFUGGO/acs',
      issuer: 'https://sso-277d8abb.sso.duosecurity.com/saml2/idp/RI8UPKP9T5WBYKXFUGGO/metadata',
      cert = process.env.SSO_CERT
      // callbackUrl: 'http://localhost:3000',
    },
    (profile, done) => done(null, profile),
)

passport.use(strategy)

module.exports = passport