const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();

const middleware = require('./lib/middleware');
const topic = require('./lib/topic');
const author = require('./lib/author');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

//custom middleware
app.get('*', middleware.list);
app.get(['/create', '/update/:pageId'], middleware.authors);

app.get('/', (req, res) => {
    topic.home(req, res);
});

app.get('/page/:pageId', (req, res) => {
    topic.page(req, res);
});

app.get('/create', (req, res) => {
    topic.create(req, res);
});

app.post('/create', (req, res) => {
    topic.create_process(req, res);
});

app.get('/update/:pageId', (req, res) => {
    topic.update(req, res);
});

app.post('/update', (req, res) => {
    topic.update_process(req, res);
});

app.post('/delete', (req, res) => {
    topic.delete_process(req, res);
});

// const app = http.createServer((req, res) => {
//     const _url = req.url;
//     const queryData = url.parse(_url, true).query;
//     const pathname = url.parse(_url, true).pathname;
//     let title = queryData.id;
//     if(pathname === '/') {
//         if(title === undefined) {
//             topic.home(req, res);
//         } else {
//             topic.page(req, res);
//         }
//     } else if(pathname == '/create') {
//         topic.create(req, res);
//     } else if(pathname === '/create_process'){
//         topic.create_process(req, res);
//     } else if(pathname === '/update'){
//         topic.update(req, res);
//     } else if(pathname === '/update_process'){
//         topic.update_process(req, res);
//     } else if(pathname === '/delete_process'){
//         topic.delete_process(req, res);
//     } else if(pathname === '/authors'){
//         author.home(req, res);
//     } else if(pathname === '/authors/create_process'){
//         author.create_process(req, res);
//     } else if(pathname === '/authors/update') {
//         author.update(req, res);
//     } else if(pathname === '/authors/update_process') {
//         author.update_process(req, res);
//     } else if(pathname === '/authors/delete_process'){
//         author.delete_process(req, res);
//     } else {
//         res.writeHead(404);
//         res.end('Not Found');
//     }
// });

app.listen(3000);