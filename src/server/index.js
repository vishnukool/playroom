require('dotenv').config({path: '.env.local'});

const express = require('express');
const bodyParser = require('body-parser');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const path = require('path')
const getProducts = require("./productService").getProducts
const LOCAL_PORT = require("./constants").LOCAL_PORT

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
});

const app = express();
app.use(bodyParser.json());

app.get('/search', async (req, res, next) => {

  if (!req.query.query) {
    const error = new Error('Required query parameter "query" missing.');
    error.status = 400;
    next(error);
  }

  try {
    const data = await getProducts(req.query.query, req.query.page)
    return res.send(data)
  } catch (err) {
    console.error(err);
    err.status = 500;
    next(err);
  }
});


//Todo: Ideally we would separate Frontend and Backend, with separate codebase/deployments.
// This is quick and dirty for a demo.
app.use(express.static(path.join(__dirname, '../../build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

app.use(async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error('Authorization header is required');

    const accessToken = req.headers.authorization.trim().split(' ')[1];
    await oktaJwtVerifier.verifyAccessToken(accessToken, 'api://default');
    next();
  } catch (error) {
    next(error.message);
  }
});

const port = process.env.PORT || LOCAL_PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
