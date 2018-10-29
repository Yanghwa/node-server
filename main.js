const http = require('http');
const fs = require('fs');
const url = require('url');
const app = http.createServer((req, res) => {
    const _url = req.url;
    const queryData = url.parse(_url, true).query;
    let title = queryData.id;
    res.writeHead(200);
    fs.readFile(`data/${title}`, 'utf8', (err, description) => {
        const template = `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
                <li><a href="/?id=HTML">HTML</a></li>
                <li><a href="/?id=CSS">CSS</a></li>
                <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>
        `;
        res.end(template);
    });
});

app.listen(3000);