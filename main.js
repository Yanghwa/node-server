const http = require('http');
const fs = require('fs');
const url = require('url');

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
    res.writeHead(200);
    if(pathname === '/') {
        let description;
        let filelist = fs.readdirSync('./data', function(error, filelist){
            return filelist;
        });
        let list = templateList(filelist);
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
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

app.listen(3000);