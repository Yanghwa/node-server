const template = require('./template');

login = (req, res) => {
    const fmsg = req.flash();
    let feedback = '';
    if(fmsg.error) {
        feedback = fmsg.error[0];
    }
    const title = 'Welcome';
    const control = template.control('','index');
    const list = template.list(req.list);
    const html = template.HTML(title, list, `
        <div style="color:red;">${feedback}</div>
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

register = (req, res) => {
    const fmsg = req.flash();
    const feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    const title = 'WEB - login';
    const list = template.list(req.list);
    const html = template.HTML(title, list, `
        <div style="color:red;">${feedback}</div>
        <form action="/auth/register_process" method="post">
          <p><input type="text" name="email" placeholder="email"></p>
          <p><input type="password" name="pwd" placeholder="password"></p>
          <p><input type="password" name="pwd2" placeholder="password"></p>
          <p><input type="text" name="displayName" placeholder="display name"></p>
          <p>
            <input type="submit" value="register">
          </p>
        </form>
      `, '');
    res.send(html);
};

authIsOwner = (req, res) => {
    if (req.user) {
        return true;
    } else {
        return false;
    }
};

authStatusUI = (req, res) => {
    let authTpl = '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>'
    if(authIsOwner(req, res)){
        authTpl = `${req.user.nickname} | <a href="/auth/logout">logout</a>`;
    }
    return authTpl;
};

module.exports = { login, login_process, logout, register, authIsOwner, authStatusUI };