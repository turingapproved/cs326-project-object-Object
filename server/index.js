import 'dotenv/config';
import express from 'express';
import expressSession from 'express-session';
import users from './users.js';
import auth from './auth.js';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import drives from './drives.js';
import requirements from './requirements.js';

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
    if (req.body.type !== (req.user.user_type_id === 1 ? 'shelter' : 'donor')) {
      // sure the user is the kind of user they are trying to log in as
      res.status(400).json({ status: 'error', message: 'Invalid username or password'}).end();
    } else {
      const user = req.user;
      res.json({ id: user.id, name: user.name, type: user.user_type_id === 1 ? 'shelter' : 'donor' }).end();
    }
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
  const { username, password, type } = req.body;
  const user = await users.getOneByName(username);
  if (user) {
    // Bad request
    res.status(400).json({ status: 'error', message: 'unable to register'});
  } else {
    await users.add(username, password, type);
    res.json({ status: 'success' });
  }
  res.end();
});

app.get(
  '/shelter/:shelterId/recentlyCreated', 
  checkLoggedIn,
  async (req, res) => {
    const { shelterId } = req.params;
    res.json(await users.getRecentlyCreated(shelterId)).end();
  }
);

app.get(
  '/donor/:donorId/recentlyViewed', 
  checkLoggedIn,
  async (req, res) => {
    const { donorId } = req.params;
    res.json(await users.getRecentlyViewed(donorId)).end();
  }
);

app.get(
  '/drive/:driveId',
  checkLoggedIn,
  async (req, res) => {
    const { driveId } = req.params;
    // We don't need to do anything with this data, don't wait for it
    users.view(req.user.id, driveId);
    res.json(await drives.getOneById(driveId)).end();
  }
);

app.get(
  '/search',
  checkLoggedIn,
  async (req, res) => {
    const { q } = req.query;
    res.json(await drives.search(q)).end();
  }
);

app.get(
  '/drive/:driveId/completionRate',
  checkLoggedIn,
  async (req, res) => {
    const { driveId } = req.params;
    res.json(await drives.getCompletionRate(driveId)).end();
  }
);

app.post(
  '/drive',
  checkLoggedIn,
  async (req, res) => {
    const { name, location, manager, description, contact_info } = req.body;
    const user = req.user;
    res.json(await drives.create(name, location, manager, contact_info, user.id)).end();
  }
);

app.get(
  '/drive/:driveId/requirements',
  checkLoggedIn,
  async (req, res) => {
    const { driveId } = req.params;
    res.json(await drives.getRequirements(driveId)).end();
  }
)

app.post(
  '/requirement',
  checkLoggedIn,
  async (req, res) => {
    const { driveId, good, quantity } = req.body;
    res.json(await requirements.create(driveId, good, quantity)).end();
  }
);

app.get(
  '/requirement/:reqId/completionRate',
  checkLoggedIn,
  async (req, res) => {
    const { reqId } = req.params
    res.json(await requirements.getCompletionRate(reqId)).end();
  }
);

app.post(
  '/requirement/:reqId/donate',
  checkLoggedIn,
  async (req, res) => {
    const { reqId } = req.params;
    const { quantity } = req.body;
    res.json(await requirements.donate(reqId, req.user.id, quantity)).end();
  }
)

app.get(
  '/requirement/:reqId',
  checkLoggedIn,
  async (req, res) => {
    const { reqId } = req.params
    res.json(await requirements.getOneById(reqId)).end();
  }
)

app.get('*', (req, res) => {
  res.send('Error');
});

app.listen(port, () => {
  console.log(`App now listening at http://localhost:${port}`);
});