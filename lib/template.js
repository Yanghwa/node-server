const sanitizeHtml = require('sanitize-html');

module.exports = {
    HTML: (title, list, body, control, authTpl=`<a href="/auth/login">login</a>`) => {
        return `
            <!doctype html>
            <html>
            <head>
                <title>WEB1 - ${sanitizeHtml(title)}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${authTpl}
                <p><a href="/authors">Authors</a></p>
                ${list}
                ${control}
                ${body}
            </body>
            </html>
        `;
    },
    list: (topics) => {
        let list = '<ul>';
        let i = 0;
        while(i < topics.length){
            list = list + `<li><a href="/topics/${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    }, control: (id, control) => {
        let editMenu;
        switch (control) {
            case 'all':
                editMenu =`<a href="/topics/create">create</a> <a href="/topics/update/${id}">update</a>
                    <form action="/topics/delete" method="post">
                        <input type="hidden" name="id" value="${id}">
                        <input type="submit" value="delete">
                    </form>
                `;
                break;
            case 'update':
                editMenu =`<a href="/topics/create">create</a> 
                    <form action="/topics/delete" method="post">
                        <input type="hidden" name="id" value="${id}">
                        <input type="submit" value="delete">
                    </form>
                `;
                break;
            case 'index':
                editMenu =`<a href="/topics/create">create</a> `;
                break;
            default:
                editMenu = '';
                break;
        }
        return editMenu;
    }, authorSelect: (authors) => {
        let tag = '';
        let i = 0;
        while(i < authors.length){
            tag += `<option value="${authors[i].id}">${sanitizeHtml(authors[i].name)}</option>`;
            i++;
        }
        return `
            <select name="author">
            ${tag}
            </select>
        `;
    }, authorTable: (authors) => {
        let tag = '<table>';
        let i = 0;
        while(i < authors.length){
            tag += `
                <tr>
                    <td>${sanitizeHtml(authors[i].name)}</td>
                    <td>${sanitizeHtml(authors[i].profile)}</td>
                    <td><a href="/authors/update/${authors[i].id}">update</a></td>
                    <td>
                        <form action="/authors/delete" method="post">
                            <input type="hidden" name="id" value="${authors[i].id}">
                            <input type="submit" value="delete">
                        </form>
                    </td>
                </tr>
                `
            i++;
        }
        tag += '</table>';
        return tag;
    }
}