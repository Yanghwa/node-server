const template = require('./template');

let tempAuthData = {
    email: 'testing@gmail.com',
    password: '1111',
    nickname: 'Super Test'
}

login = (req, res) => {
    const title = 'Welcome';
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
    if(post.email === tempAuthData.email && post.password === tempAuthData.password) {
        req.session.is_logined = true;
        req.session.nickname = tempAuthData.nickname;
        res.redirect(`/`);
    } else {
        res.send('Why?');
    }
};

logout = (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
};

authIsOwner = (req, res) => {
    if (req.session.is_logined) {
        return true;
    } else {
        return false;
    }
};

authStatusUI = (req, res) => {
    let authTpl = '<a href="/auth/login">login</a>'
    if(authIsOwner(req, res)){
        authTpl = `${req.session.nickname} | <a href="/auth/logout">logout</a>`;
    }
    return authTpl;
};

module.exports = { login, login_process, logout, authIsOwner, authStatusUI };