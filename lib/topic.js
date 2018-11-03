const sanitizeHtml = require('sanitize-html');

const db = require('./db');
const template = require('./template');

home = (req, res) => {
    const title = 'Welcome';
    const description = 'Hello, Node.js';
    const control = template.control('','index');
    const list = template.list(req.list);
    const html = template.HTML(title, list, `<h2>${title}</h2>${description}`, control);
    res.writeHead(200);
    res.end(html);
};

page = (req, res) => {
    const id = req.params.pageId;
    db.query(`SELECT topic.id, topic.title, topic.description, topic.created, topic.author_id, author.name, author.profile
        FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[id], (error2, topic) => {
        if(error2) throw error2;
        const list = template.list(req.list);
        const control = template.control(topic[0].id,'all');
        const html = template.HTML(topic[0].title, list, 
            `
                <h2>${sanitizeHtml(topic[0].title)}</h2>${sanitizeHtml(topic[0].description)}
                <p>by ${sanitizeHtml(topic[0].name)}</p>
            `, control);
        res.end(html);
    });
};

create = (req, res) => {
    const title = 'Create';
    const list = template.list(req.list);
    const html = template.HTML(title, list, `
        <form action="/create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                ${template.authorSelect(req.authors)}
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
    `, '');
    res.writeHead(200);
    res.end(html);
};

create_process = (req, res) => {
    let post = req.body;
    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, [post.title, post.description, post.author], 
        (err, result) => {
            if(err) throw err;
            res.writeHead(302, {Location: `/page/${result.insertId}`});
            res.end();
    });
};

update = (req, res) => {
    const title = 'Update';
    const id = req.params.pageId;
    const list = template.list(req.list);
    db.query(`SELECT topic.id, topic.title, topic.description, topic.created, topic.author_id, author.name, author.profile
    FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[id], (error2, topic) => {
        if(error2) throw error2;
        const control = template.control(topic[0].id,'update');
        const html = template.HTML(title, list,
            `
                <form action="/update" method="post">
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
                    </p>
                    <p>
                        ${template.authorSelect(req.authors, topic[0].author_id)}
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `,
            control
        );
        res.writeHead(200);
        res.end(html);
    });
};

update_process = (req, res) => {
    let post = req.body;
    db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], 
        (error, result) => {
            res.writeHead(302, {Location: `/page/${post.id}`});
            res.end();
    });
};

delete_process = (req, res) => {
    let post = req.body;
    db.query('DELETE FROM topic WHERE id = ?', [post.id], (error, result) => {
        if(error) throw error;
        res.writeHead(302, {Location: `/`});
        res.end();
    });
};

module.exports = { home, page, create, create_process, update, update_process, delete_process };