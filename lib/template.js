module.exports = {
    HTML: (title, list, body, control) => {
        let editMenu;
        switch (control) {
            case 'all':
                editMenu =`<a href="/create">create</a> <a href="/update?id=${title}">update</a>
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                    </form>
                `;
                break;
            case 'update':
                editMenu =`<a href="/create">create</a> 
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
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
                ${editMenu}
                ${body}
            </body>
            </html>
        `;
    },
    list: (filelist) => {
        let list = '<ul>';
        let i = 0;
        while(i < filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    }
}