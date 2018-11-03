const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();

const middleware = require('./lib/middleware');
const topic = require('./lib/topic');
const author = require('./lib/author');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

//custom middleware
app.get('*', middleware.list);
app.get(['/topics/create', '/topics/update/:topicId', '/authors', '/authors/update/:authorId'], middleware.authors);

app.get('/', (req, res) => {
    topic.home(req, res);
});

app.get('/topics/create', (req, res) => {
    topic.create(req, res);
});

app.post('/topics/create', (req, res) => {
    topic.create_process(req, res);
});

app.get('/topics/update/:topicId', (req, res) => {
    topic.update(req, res);
});

app.post('/topics/update', (req, res) => {
    topic.update_process(req, res);
});

app.post('/topics/delete', (req, res) => {
    topic.delete_process(req, res);
});

app.get('/topics/:topicId', (req, res) => {
    topic.detail(req, res);
});

app.get('/authors', (req, res) => {
    author.home(req, res);
});

app.get('/authors/create', (req, res) => {
    author.create(req, res);
});

app.post('/authors/create', (req, res) => {
    author.create_process(req, res);
});

app.get('/authors/update/:authorId', (req, res) => {
    author.update(req, res);
});

app.post('/authors/update', (req, res) => {
    author.update_process(req, res);
});

app.post('/authors/delete', (req, res) => {
    author.delete_process(req, res);
});

app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that!');
});
   
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000);