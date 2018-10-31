module.exports = {
    HTML: (title, list, body, control) => {
        return `
            <!doctype html>
            <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
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
            list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    }, control: (id, control) => {
        let editMenu;
        switch (control) {
            case 'all':
                editMenu =`<a href="/create">create</a> <a href="/update?id=${id}">update</a>
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${id}">
                        <input type="submit" value="delete">
                    </form>
                `;
                break;
            case 'update':
                editMenu =`<a href="/create">create</a> 
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${id}">
                        <input type="submit" value="delete">
                    </form>
                `;
                break;
            case 'index':
                editMenu =`<a href="/create">create</a> `;
                break;
            default:
                editMenu = '';
                break;
        }
        return editMenu;
    }, authorSelect:function(authors){
        let tag = '';
        let i = 0;
        while(i < authors.length){
            tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
            i++;
        }
        return `
            <select name="author">
            ${tag}
            </select>
        `;
    }
}