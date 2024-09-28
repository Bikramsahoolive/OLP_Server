const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.server_url}/auth/google/callback`
},
  function (accessToken, refreshToken, profile, done) {
    const user = { username: profile.displayName, usertype: 'NA', useremail: profile.emails[0].value, password: 'GoogleCredential' };
    return done(null, user);
  }
));
