const express = require('express');

const topic = require('../lib/topic');

const router = express.Router();

router.get('/create', (req, res) => {
    topic.create(req, res);
});

router.post('/create', (req, res) => {
    topic.create_process(req, res);
});

router.get('/update/:topicId', (req, res) => {
    topic.update(req, res);
});

router.post('/update', (req, res) => {
    topic.update_process(req, res);
});

router.post('/delete', (req, res) => {
    topic.delete_process(req, res);
});

router.get('/:topicId', (req, res) => {
    topic.detail(req, res);
});

module.exports = router;