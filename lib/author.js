const url = require('url');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');

const db = require('./db');
const template = require('./template');

home = (req, res) => {
    const title = 'Authors';
    const list = template.list(req.list);
    const html = template.HTML(title, list, `
        ${template.authorTable(req.authors)}
        <style>
            table{
                border-collapse: collapse;
            }
            td{
                border:1px solid black;
            }
        </style>
        <form action="/authors/create" method="post">
            <p>
                <input type="text" name="name" placeholder="name">
            </p>
            <p>
                <textarea name="profile" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit"  value="create">
            </p>
        </form>
    `, '');
    res.writeHead(200);
    res.end(html);
};

create_process = (req, res) => {
    let post = req.body;
    db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`, [post.name, post.profile], 
        (err, result) => {
            if(err) throw err;
            res.writeHead(302, {Location: `/authors`});
            res.end();
    });
};

update = (req, res) => {
    const id = req.params.authorId;
    const list = template.list(req.list);
    db.query(`SELECT * FROM author WHERE id=?`,[id], (error3,author) => {
        const html = template.HTML(id, list,
            `
                ${template.authorTable(req.authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                <form action="/authors/update" method="post">
                    <input type="hidden" name="id" value="${author[0].id}">
                    <p><input type="text" name="name" placeholder="name" value="${sanitizeHtml(author[0].name)}"></p>
                    <p>
                        <textarea name="profile" placeholder="profile">${sanitizeHtml(author[0].profile)}</textarea>
                    </p>
                    <p>
                        <input type="submit" value="update">
                    </p>
                </form>
            `,
            ''
        );
        res.writeHead(200);
        res.end(html);
    });
};

update_process = (req, res) => {
    let post = req.body;
    db.query('UPDATE author SET name=?, profile=? WHERE id=?', [post.name, post.profile, post.id],
        (error, result) => {
            res.writeHead(302, {Location: `/authors`});
            res.end();
    });
};

delete_process = (req, res) => {
    let post = req.body;
    db.query('DELETE FROM topic WHERE author_id = ?', [post.id], (error1, result1) => {
        //or db.escape(post.id)
        if(error1) throw error1;
        db.query('DELETE FROM author WHERE id = ?', [post.id], (error, result) => {
            if(error) throw error;
            res.writeHead(302, {Location: `/authors`});
            res.end();
        });
    });
};

module.exports = { home, create_process, update, update_process, delete_process };