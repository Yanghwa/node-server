const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

templateHTML = (title, list, body, control) => {
    let editMenu;
    switch (control) {
        case 'all':
            editMenu =`<a href="/create">create</a> <a href="/update?id=${title}">update</a>
                <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                </form>
            `;
            break;
        case 'update':
            editMenu =`<a href="/create">create</a> 
                <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                </form>
            `;
            break;
        case 'index':
            editMenu =`<a href="/create">create</a> `;
            break;
        default:
            editMenu = '';
            break;
    }
    
    return `
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${editMenu}
            ${body}
        </body>
        </html>
    `;
}
templateList = (filelist) => {
    let list = '<ul>';
    let i = 0;
    while(i < filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list+'</ul>';
    return list;
}

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
    let list = templateList(filelist);
    res.writeHead(200);
    if(pathname === '/') {
        if(title === undefined) {
            title = 'Welcome';
            description = 'Hello, Node.js';
            control = 'index';
        } else {
            description = fs.readFileSync(`data/${title}`, 'utf8', (err, description) => {
                return description;
            });
            control = 'all';
        }
        const template = templateHTML(title, list, `<h2>${title}</h2>${description}`, control);
        res.end(template);
    } else if(pathname == '/create') {
        title = 'WEB - create';
        const template = templateHTML(title, list, `
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
        res.end(template);
    } else if(pathname === '/create_process'){
        let body = '';
        req.on('data', (data) => {
            body = body + data;
        });
        req.on('end', () => {
            let post = qs.parse(body);
            title = post.title;
            description = post.description
            fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
                res.writeHead(302, {Location: `/?id=${title}`}); //after creating a file, redirect
                res.end();
            });
        });
    } else if(pathname === '/update'){
        description = fs.readFileSync(`data/${title}`, 'utf8', (err, description) => {
            return description;
        });
        const template = templateHTML(title, list,
            `
                <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>
            `,
            'all'
        );
        res.writeHead(200);
        res.end(template);
    } else if(pathname === '/update_process'){
        let body = '';
        req.on('data', (data) => {
            body = body + data;
        });
        req.on('end', () => {
            let post = qs.parse(body);
            let id = post.id;
            title = post.title;
            description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, (error) => {
                fs.writeFile(`data/${title}`, description, 'utf8', (err) =>{
                    res.writeHead(302, {Location: `/?id=${title}`});
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
            fs.unlink(`data/${id}`, (error) => {
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