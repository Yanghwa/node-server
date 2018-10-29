const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

function templateHTML(title, list, body){
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
        <a href="/create">create</a>
        ${body}
        </body>
        </html>
    `;
}
function templateList(filelist){
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
    let filelist = fs.readdirSync('./data', function(error, filelist){
        return filelist;
    });
    let list = templateList(filelist);
    res.writeHead(200);
    if(pathname === '/') {
        if(title === undefined) {
            title = 'Welcome';
            description = 'Hello, Node.js';
        } else {
            description = fs.readFileSync(`data/${title}`, 'utf8', function(err, description){
                return description;
            });
        }
        const template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
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
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

app.listen(3000);