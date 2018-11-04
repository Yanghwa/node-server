const template = require('./template');
const auth = require('./auth');

main = (req, res) => {
    const fmsg = req.flash();
    let feedback = '';
    if(fmsg.success){
        feedback = fmsg.success[0];
    }
    const title = 'Welcome';
    const description = 'Hello, Node.js';
    const control = template.control('','index');
    const list = template.list(req.list);
    const html = template.HTML(title, list, `
        <div style="color:blue;">${feedback}</div>
        <h2>${title}</h2>
        <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
        ${description}

    `, control, auth.authStatusUI(req, res));
    res.writeHead(200);
    res.end(html);
};

module.exports = main;