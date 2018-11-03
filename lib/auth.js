const template = require('./template');

login = (req, res) => {
    const title = 'Welcome';
    const description = 'Hello, Node.js';
    const control = template.control('','index');
    const list = template.list(req.list);
    const html = template.HTML(title, list, `
        <form action="/auth/login" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit"></p>
        </form>
    `, control);
    res.writeHead(200);
    res.end(html);
};

login_process = (req, res) => {
    let post = req.body;
    if(post.email === 'testing@gmail.com' && post.password === '1111') {
        res.writeHead(302, {
            'Set-Cookie':[
                `email=${post.email}`,
                `password=${post.password}`,
                `nickname=egoing`
            ], Location: `/`
        });
    }
    res.end();
};
module.exports = { login, login_process };