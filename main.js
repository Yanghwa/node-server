const http = require('http');
const url = require('url');
const qs = require('querystring');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'opentutorials'
});

db.connect();

const template = require('./lib/template');

const app = http.createServer((req, res) => {
    const _url = req.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    let title = queryData.id;
    let description;
    let control;
    db.query(`SELECT * FROM topic`, (err, topics) => {
        if(err) throw err;
        let list = template.list(topics);
        if(pathname === '/') {
            if(title === undefined) {
                title = 'Welcome';
                description = 'Hello, Node.js';
                control = template.control('','index');
                let sanitizeTitle = sanitizeHtml(title);
                let sanitizeDescription = sanitizeHtml(description);
                const html = template.HTML(title, list, `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`, control);
                res.end(html);
            } else {
                db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[queryData.id], (error2, topic) => {
                    if(error2) throw error2;
                    control = template.control(topic[0].id,'all');
                    let sanitizeTitle = sanitizeHtml(topic[0].title);
                    let sanitizeDescription = sanitizeHtml(topic[0].description);
                    const html = template.HTML(topic[0].id, list, 
                        `
                            <h2>${sanitizeTitle}</h2>${sanitizeDescription}
                            <p>by ${topic[0].name}</p>
                        `, control);
                    res.end(html);
                });
            }
        } else if(pathname == '/create') {
            title = 'WEB - create';
            const html = template.HTML(title, list, `
            <form action="http://localhost:3000/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                <input type="submit">
                </p>
            </form>
            `);
            res.writeHead(200);
            res.end(html);
        } else if(pathname === '/create_process'){
            let body = '';
            req.on('data', (data) => {
                body = body + data;
            });
            req.on('end', () => {
                let post = qs.parse(body);
                db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, [post.title, post.description, 1], 
                    (err, result) => {
                        if(err) throw err;
                        res.writeHead(302, {Location: `/?id=${result.insertId}`});
                        res.end();
                });
            });
        } else if(pathname === '/update'){
            db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], (error2, topic) => {
                if(error2) throw error2;
                control = template.control(topic[0].id,'all');
                let sanitizeTitle = sanitizeHtml(topic[0].title);
                let sanitizeDescription = sanitizeHtml(topic[0].description);
                const html = template.HTML(queryData.id, list,
                    `
                        <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}">
                        <p><input type="text" name="title" placeholder="title" value="${sanitizeTitle}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${sanitizeDescription}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                        </form>
                    `,
                    control
                );
                res.writeHead(200);
                res.end(html);
            });
        } else if(pathname === '/update_process'){
            let body = '';
            req.on('data', (data) => {
                body = body + data;
            });
            req.on('end', () => {
                let post = qs.parse(body);
                db.query('UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?', [post.title, post.description, post.id], 
                    (error, result) => {
                        res.writeHead(302, {Location: `/?id=${post.id}`});
                        res.end();
                });
            });
        } else if(pathname === '/delete_process'){
            let body = '';
            req.on('data', (data) =>{
                body = body + data;
            });
            req.on('end', () =>{
                let post = qs.parse(body);
                db.query('DELETE FROM topic WHERE id = ?', [post.id], (error, result) => {
                    if(error) throw error;
                    res.writeHead(302, {Location: `/`});
                    res.end();
                })
            });
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    });
});

app.listen(3000);