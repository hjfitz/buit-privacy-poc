const express = require('express');
const contentful = require('./contentful');

const router = express.Router();

router.get('/', (req, res) => res.json('oi'));

router.use('/contentful', contentful);

module.exports = router;
