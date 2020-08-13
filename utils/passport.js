const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const User = require('../models/User');

passport.use(
  new GoogleStrategy({
    clientID: '361540274663-5nsj3j94dtvokp21hrvlb8i93c53lgta.apps.googleusercontent.com',
    clientSecret: 'NMLzm8YBcXcMSIPkIUuV5OuI',
    callbackURL: "/login/google/redirect"
  },
  async (accessToken, refreshToken, profile, cb) => {
    const { email } = profile._json;
    const user = await User.findById(profile.id);
    if (user) {

    }
    new User({
      email
    }).save();
    cb();
  })
);