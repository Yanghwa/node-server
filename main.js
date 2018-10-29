const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const template = require('./lib/template');

const app = http.createServer((req, res) => {
    const _url = req.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    let title = queryData.id;
    let description;
    let control;
    let filelist = fs.readdirSync('./data', (error, filelist) => {
        return filelist;
    });
    let list = template.list(filelist);
    res.writeHead(200);
    if(pathname === '/') {
        if(title === undefined) {
            title = 'Welcome';
            description = 'Hello, Node.js';
            control = 'index';
        } else {
            let filteredId = path.parse(title).base;
            description = (() => {
                try {
                    return fs.readFileSync(`data/${filteredId}`, 'utf8', (err, description) => {
                        return description;
                    });
                } catch (err) {
                    return ;
                }
            })();
            control = 'all';
        }
        let sanitizeTitle = sanitizeHtml(title);
        let sanitizeDescription = sanitizeHtml(description);
        const html = template.HTML(sanitizeTitle, list, `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`, control);
        res.end(html);
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
            title = post.title;
            let filteredId = path.parse(title).base;
            description = post.description
            let sanitizeTitle = sanitizeHtml(title);
            let sanitizeDescription = sanitizeHtml(description);
            fs.writeFile(`data/${filteredId}`, sanitizeDescription, 'utf8', (err) => {
                res.writeHead(302, {Location: `/?id=${sanitizeTitle}`}); //after creating a file, redirect
                res.end();
            });
        });
    } else if(pathname === '/update'){
        let filteredId = path.parse(title).base;
        description = (() => {
            try {
                return fs.readFileSync(`data/${filteredId}`, 'utf8', (err, description) => {
                    return description;
                });
            } catch (err) {
                return ;
            }
        })();
        let sanitizeTitle = sanitizeHtml(title);
        let sanitizeDescription = sanitizeHtml(description);
        const html = template.HTML(title, list,
            `
                <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${sanitizeTitle}">
                <p><input type="text" name="title" placeholder="title" value="${sanitizeTitle}"></p>
                <p>
                    <textarea name="description" placeholder="description">${sanitizeDescription}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>
            `,
            'all'
        );
        res.writeHead(200);
        res.end(html);
    } else if(pathname === '/update_process'){
        let body = '';
        req.on('data', (data) => {
            body = body + data;
        });
        req.on('end', () => {
            let post = qs.parse(body);
            let id = post.id;
            title = post.title;
            let sanitizeTitle = sanitizeHtml(title);
            description = post.description;
            let filteredId = path.parse(id).base;
            fs.rename(`data/${filteredId}`, `data/${sanitizeTitle}`, (error) => {
                fs.writeFile(`data/${sanitizeTitle}`, description, 'utf8', (err) =>{
                    res.writeHead(302, {Location: `/?id=${sanitizeTitle}`});
                    res.end();
                })
            });
        });
    } else if(pathname === '/delete_process'){
        let body = '';
        req.on('data', (data) =>{
            body = body + data;
        });
        req.on('end', () =>{
            let post = qs.parse(body);
            let id = post.id;
            let filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, (error) => {
              res.writeHead(302, {Location: `/`});
              res.end();
            })
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

app.listen(3000);