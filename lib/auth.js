const template = require('./template');

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
        req.session.save(() => {
            res.redirect(`/`);
        });
    } else {
        res.send('Why?');
    }
};

logout = (req, res) => {
    req.logout();
    req.session.save(function(){
        res.redirect('/');
    });
};

authIsOwner = (req, res) => {
    if (req.user) {
        return true;
    } else {
        return false;
    }
};

authStatusUI = (req, res) => {
    let authTpl = '<a href="/auth/login">login</a>'
    if(authIsOwner(req, res)){
        authTpl = `${req.user.nickname} | <a href="/auth/logout">logout</a>`;
    }
    return authTpl;
};

module.exports = { login, login_process, logout, authIsOwner, authStatusUI };