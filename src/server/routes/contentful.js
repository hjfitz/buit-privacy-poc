const contentful = require('contentful');
const express = require('express');
const logger = require('../logger');

const api = express.Router();

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESS,
});

api.get('/', async (req, res) => {
  // logger('debug', 'contentful api @ /', 'attempting to get entries');
  const { items } = await client.getEntries({ content_type: 'privacyInformation', include: 10 });
  res.json(items);
});

module.exports = api;
