const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');

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
app.use(flash());
app.get('/flash', function(req, res){
    // Set a flash message by passing the key, followed by the value, to req.flash().
    req.flash('msg', 'Flash is back!!');
    res.send('flash');
});

app.get('/flash-display', function(req, res){
    // Get an array of flash messages by passing the key to req.flash()
    const fmsg =  req.flash();
    res.send(fmsg);
});

let tempAuthData = {
    email: 'testing@gmail.com',
    password: '1111',
    nickname: 'Super Test'
}

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((id, done) => {
    done(null, tempAuthData);
});

passport.use(new LocalStrategy({
    usernameField: 'email'
}, (username, password, done) => {
    if(username === tempAuthData.email) {
        if(password === tempAuthData.password) {
            return done(null, tempAuthData, {
                message: 'Welcome.'
            });
        } else {
            return done(null, false, {
                message: 'Incorrect password.'
            });
        }
    } else {
        return done(null, false, {
            message: 'Incorrect username.'
        });
    }
}));
app.post('/auth/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash:true,
        successFlash:true
    }));

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