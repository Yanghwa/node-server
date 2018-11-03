const db = require('./db');

list = (req, res, next) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if(err) next(err);
        req.list = topics;
        next();
    });
};

authors = (req, res, next) => {
    db.query(`SELECT * FROM author`, (err, authors) => {
        if(err) next(err);
        req.authors = authors;
        next();
    });
};

module.exports = { list, authors }