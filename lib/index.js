const template = require('./template');

authIsOwner = (req, res) => {
    if (req.session.is_logined) {
      return true;
    } else {
      return false;
    }
};

authStatusUI = (req, res) => {
    var authTpl = '<a href="/auth/login">login</a>'
    if(authIsOwner(req, res)){
        authTpl = `${req.session.nickname} | <a href="/auth/logout">logout</a>`;
    }
    return authTpl;
  }

main = (req, res) => {
    const title = 'Welcome';
    const description = 'Hello, Node.js';
    const control = template.control('','index');
    const list = template.list(req.list);
    const html = template.HTML(title, list, `
        <h2>${title}</h2>
        <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
        ${description}

    `, control, authStatusUI(req, res));
    res.writeHead(200);
    res.end(html);
};

module.exports = main;