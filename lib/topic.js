const db = require('./db');
const template = require('./template');

home = (req, res, control) => {
    db.query(`SELECT * FROM topic`, (err, topics) => {
        const title = 'Welcome';
        const description = 'Hello, Node.js';
        const list = template.list(topics);
        const html = template.HTML(title, list, `<h2>${title}</h2>${description}`, control);
        res.writeHead(200);
        res.end(html);
    });
};

module.exports = { home };