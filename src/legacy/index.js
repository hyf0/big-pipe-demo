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

const makeHTML = (data) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>legacy</title>
    <link rel="stylesheet" href="/legecy/index.css">
</head>
<body>
    <div class="red">
        我是红：cgi时间是 ${data.red} ms
    </div>
    <div class="yellow">
        我是黄：cgi时间是 ${data.yellow} ms
    </div>
    <div class="blue">
        我是蓝：cgi时间是 ${data.blue} ms
    </div>
</body>
</html>
`;

app.use(async (ctx, next) => {
    const datas = await Promise.all([
        getRedData(),
        getYellowData(),
        getBlueData(),
    ]);

    const data = {
        red: datas[0],
        yellow: datas[1],
        blue: datas[2],
    };

    const html = makeHTML(data);

    ctx.body = html;
});

const server = app.listen(3030, '127.0.0.1', () => {
    console.log(`server start in http://127.0.0.1:${3030}`);
});