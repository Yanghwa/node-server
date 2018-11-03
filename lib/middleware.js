const db = require('./db');

list = (req, res, next) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        req.list = topics;
        next();
    });
};

authors = (req, res, next) => {
    db.query(`SELECT * FROM author`, (err, authors) => {
        req.authors = authors;
        next();
    });
};

module.exports = { list, authors }