const express = require('express');
const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(String(err));
  }
});

module.exports = { router, register };
