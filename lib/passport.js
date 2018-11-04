module.exports = (app) => {
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
    return passport;
};
