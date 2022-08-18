import 'dotenv/config';
import express from 'express';
import expressSession from 'express-session';
import users from './users.js';
import auth from './auth.js';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// We will use __dirname later on to send files back to the client.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

// Create the Express app
const app = express();
const port = process.env.PORT || 3000;

// Session configuration
const sessionConfig = {
  // set this encryption key in Heroku config (never in GitHub)!
  secret: process.env.SECRET || 'SECRET',
  resave: false,
  saveUninitialized: false,
};

// Setup the session middleware
app.use(expressSession(sessionConfig));
// Allow JSON inputs
app.use(express.json());
// Allow URLencoded data
app.use(express.urlencoded({ extended: true }));
// Logger
app.use(logger('dev'));
// Allow static file serving
app.use('/', express.static('client'));
// Configure our authentication strategy
auth.configure(app);

// Our own middleware to check if the user is authenticated
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // If we are authenticated, run the next route.
    next();
  } else {
    // Otherwise, send an error
    res.status(403).json({ status: 'unauthorized' }).end();
  }
}

// Handle post request
app.post(
  '/auth/login',
  auth.authenticate('local'),
  (req, res) => {
    // handle success
    const user = req.user;
    res.json({ id: user.id, type: user.user_type === 1 ? 'shelter' : 'donor' }).end();
  },
  (err, req, res, next) => {
    // handle failure (bad request)
    res.status(400).json({ status: 'error', message: 'Invalid username or password'}).end();
  }
);

// Handle logging out
app.get('/auth/logout', (req, res) => {
  req.logout(); // Logs us out!
  res.json({ status: 'success' }).end();
});

// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post('/auth/register', async (req, res) => {
  const { username, password, user_type } = req.body;
  const user = await users.getOneByName(username);
  if (user) {
    // Bad request
    res.status(400).json({ status: 'unable to register'});
  } else {
    const uid = await users.add(username, password, user_type);
    if (uid) {
      auth.authenticate('local');
      return res.json({ status: 'success' });
    }
    
  }
  res.end();
});

app.get('*', (req, res) => {
  res.send('Error');
});

app.listen(port, () => {
  console.log(`App now listening at http://localhost:${port}`);
});