const express = require('express');

const auth = require('../lib/auth');

const router = express.Router();

router.get('/login', (req, res) => {
    auth.login(req, res);
});

module.exports = router;