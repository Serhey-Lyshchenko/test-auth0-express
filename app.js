const { auth, requiresAuth } = require('express-openid-connect');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();

const { organizationsRouter } = require("./organizations/organizations.router");
const { errorHandler } = require("./middleware/error.middleware");
const { notFoundHandler } = require("./middleware/not-found.middleware");

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.CLIENT_SECRET,
};

app.use(auth(config));
// CORS
app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, x-client-access-token, x-access-token, content-type, Authorization, Content-Type'
  );

  // To Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //set access control max age to prevent duplicate options request
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  }

  // Pass to next layer of middleware
  next();

});

app.use('/status',(req, res) => {
  res.send({
    status: 'ok'
  });
})

const apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.use("/organizations", organizationsRouter);

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.use(errorHandler);
app.use(notFoundHandler);

module.exports = app;
