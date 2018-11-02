const http = require('http');
const url = require('url');

const topic = require('./lib/topic');

const app = http.createServer((req, res) => {
    const _url = req.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
    let title = queryData.id;
    if(pathname === '/') {
        if(title === undefined) {
            topic.home(req, res);
        } else {
            topic.page(req, res);
        }
    } else if(pathname == '/create') {
        topic.create(req, res);
    } else if(pathname === '/create_process'){
        topic.create_process(req, res);
    } else if(pathname === '/update'){
        topic.update(req, res);
    } else if(pathname === '/update_process'){
        topic.update_process(req, res);
    } else if(pathname === '/delete_process'){
        topic.delete_process(req, res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

app.listen(3000);