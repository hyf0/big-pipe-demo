const Koa = require('koa');
const static = require("koa-static");
const path = require('path')

const app = new Koa();
console.log(__dirname);
app.use(static(path.resolve(__dirname, '../../static')));

const asyncWait = (time = 1000) => new Promise(resove => setTimeout(resove, time));

const getRedData = async () => {
    const time = 1000;
    const date = Date.now();
    await asyncWait(time);
    return Date.now() - date;
}

const getYellowData = async () => {
    const time = 3000;
    const date = Date.now();
    await asyncWait(time);
    return Date.now() - date;
}

const getBlueData = async () => {
    const time = 5000;
    const date = Date.now();
    await asyncWait(time);
    return Date.now() - date;
}

const startHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>big-pipe</title>
    <style>
            * {
            margin: 0;
        }
    </style>
    <script>
        const BigPipe = window.BigPipe = {};
        BigPipe.downloadCSS = href => new Promise((resolve, reject) => {
            var node = document.createElement('link');
            node.onload = resolve;
            node.onerror = reject;
            node.type = 'text/css';
            node.rel = 'stylesheet';
            node.href = href;
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(node);
            console.log(head);
        });
        BigPipe.handlePagelet = async pagelet => {
            const container = document.querySelector(pagelet.selector);
            if (container) {
                await Promise.all(pagelet.css.map(href => BigPipe.downloadCSS(href)));
                container.innerHTML = pagelet.content;
            }
        };
    </script>
</head>
<body>
    <div class="red"></div>
    <div class="yellow"></div>
    <div class="blue"></div>
`;

const generateMakeup = (selector, content, css = [], js = []) => {
    const pagelet = {
        selector,
        content,
        css,
        js,
    };
    return `
    <script>
        BigPipe.handlePagelet(${JSON.stringify(pagelet)});
    </script>
    `;

}

app.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    ctx.res.write(startHTML);
    await Promise.all([
        getRedData()
            .then(time => {
                const html = `我是红：cgi时间是 ${time} ms`;
                ctx.res.write(generateMakeup(
                    '.red',
                    html,
                    ['/big-pipe/red.css'],
                    ));
            }),
        getYellowData()
            .then(time => {
                const html = `我是黄：cgi时间是 ${time} ms`;
                ctx.res.write(generateMakeup(
                    '.yellow',
                    html,
                    ['/big-pipe/yellow.css'],
                    ));
            }),
        getBlueData()
            .then(time => {
                const html = `我是蓝：cgi时间是 ${time} ms`;
                ctx.res.write(generateMakeup(
                    '.blue',
                    html,
                    ['/big-pipe/blue.css'],
                    ));
            }),
    ]);

    ctx.res.end(`
        </body>
    </html>
    `);
});

const server = app.listen(3031, '127.0.0.1', () => {
    console.log(`server start in http://127.0.0.1:${3031}`);
});