import passport from 'passport';
import passportLocal from 'passport-local';
import users from './users.js';

const { Strategy } = passportLocal;

// Passport Configuration
// Create a new LocalStrategy object to handle authentication using username and
// password credentials from the client. The LocalStrategy object is used to
// authenticate a user using a username and password.
const strategy = new Strategy(async (username, password, done) => {
  const user = await users.getOneByName(username);
  if (!user) {
    // no such user - N.B. don't tell users if the username or the password
    // caused the rejection, this is insecure
    return done(null, false, { message: 'Unable to log in' });
  }
  if (user.password != password) {
    // invalid password
    // should disable logins after N messages
    // delay return to rate-limit brute-force attacks
    await new Promise((r) => setTimeout(r, 2000)); // two second delay
    return done(null, false, { message: 'Unable to log in' });
  }
  // success!
  // should create a user object here, associated with a unique identifier
  return done(null, user);
});

// Configure passport to use the LocalStrategy object.
// The LocalStrategy object is used to authenticate a user using a username and
// password. There are other strategies available, but this is the simplest.
passport.use(strategy);

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
  done(null, await users.getOneById(uid));
});

export default {
  configure: (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
  },

  authenticate: (domain, where) => {
    return passport.authenticate(domain, where);
  },
};