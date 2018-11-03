const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');

const middleware = require('./lib/middleware');

const topicRouter = require('./routes/topics');
const authorRouter = require('./routes/authors');
const indexRouter = require('./routes/index');

const app = express();

// app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

//custom middleware
app.get('*', middleware.list);
app.get(['/topics/create', '/topics/update/:topicId', '/authors', '/authors/update/:authorId'], middleware.authors);

app.use('/topics', topicRouter);
app.use('/authors', authorRouter);
app.use('/', indexRouter);

app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that!');
});
   
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000);