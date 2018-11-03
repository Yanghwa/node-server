const express = require('express');

const root = require('../lib/index');

const router = express.Router();

router.get('/', (req, res) => {
    root(req, res);
});

module.exports = router;