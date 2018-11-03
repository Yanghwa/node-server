const express = require('express');

const auth = require('../lib/auth');

const router = express.Router();

router.get('/login', (req, res) => {
    auth.login(req, res);
});

router.post('/login', (req, res) => {
    auth.login_process(req, res);
});

router.get('/logout', (req, res) => {
    auth.logout(req, res);
});

module.exports = router;