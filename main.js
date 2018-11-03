const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const middleware = require('./lib/middleware');

const authRouter = require('./routes/auth');
const topicRouter = require('./routes/topics');
const authorRouter = require('./routes/authors');
const indexRouter = require('./routes/index');

const app = express();

app.use(helmet.dnsPrefetchControl());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//custom middleware
app.get('*', middleware.list);
app.get(['/topics/create', '/topics/update/:topicId', '/authors', '/authors/update/:authorId'], middleware.authors);

app.use('/auth', authRouter);
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