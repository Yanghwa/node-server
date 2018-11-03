const template = require('./template');

main = (req, res) => {
    const title = 'Welcome';
    const description = 'Hello, Node.js';
    const control = template.control('','index');
    const list = template.list(req.list);
    const html = template.HTML(title, list, `
        <h2>${title}</h2>
        <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
        ${description}

    `, control);
    res.writeHead(200);
    res.end(html);
};

module.exports = main;