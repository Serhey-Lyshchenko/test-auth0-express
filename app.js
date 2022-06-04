const { auth, requiresAuth } = require('express-openid-connect');
const express = require('express');
const bodyParser = require('body-parser');
const { organizationsRouter } = require("./organizations/organizations.router");
const { errorHandler } = require("./middleware/error.middleware");
const { notFoundHandler } = require("./middleware/not-found.middleware");

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: 'http://localhost:5000',
  clientID: 'M1D6YKlfNY0r4BeXKVulA1uNQJFHFuSF',
  issuerBaseURL: 'https://some-tenant-name.us.auth0.com',
  secret: 'ccc2dec2548c5052cc7adb7df118e1c4aff85224f3de5daf8d9781e964e6493a',
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
// app.use(errorHandler);
// app.use(notFoundHandler);
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

module.exports = app;
