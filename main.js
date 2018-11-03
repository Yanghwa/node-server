const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();

const middleware = require('./lib/middleware');
const topic = require('./lib/topic');
const author = require('./lib/author');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

//custom middleware
app.get('*', middleware.list);
app.get(['/create', '/update/:pageId'], middleware.authors);

app.get('/', (req, res) => {
    topic.home(req, res);
});

app.get('/page/:pageId', (req, res) => {
    topic.page(req, res);
});

app.get('/create', (req, res) => {
    topic.create(req, res);
});

app.post('/create', (req, res) => {
    topic.create_process(req, res);
});

app.get('/update/:pageId', (req, res) => {
    topic.update(req, res);
});

app.post('/update', (req, res) => {
    topic.update_process(req, res);
});

app.post('/delete', (req, res) => {
    topic.delete_process(req, res);
});

app.listen(3000);