const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = new (require('koa-router'))();
const fs = require('fs');
const Vue = require('vue');
const devMode = process.env.NODE_ENV !== 'production';
const controller = require('./server/controller/page1');

app.use(bodyParser());

app.use(async (ctx, next) => {
    await next();
});

function createRender(serverBundle, template) {
    return require('vue-server-renderer').createBundleRenderer(serverBundle, {
        template,
        runInNewContext: false,
    });
}

let renderer;

if (devMode) {
    const createDevBundle = require('./webpack/set-dev-server');
    createDevBundle(app, `${__dirname}/index.template.html`, (bundle, {template}) => {
        renderer = createRender(bundle, template);
    })
} else {
    const serverBundle = require('./dist/vue-ssr-server-bundle');
    const template = fs.readFileSync(('./index.template.html'), 'utf-8');
    renderer = createRender(serverBundle, template)
}

router.get('/test', async (ctx, next) => {
    if (!renderer) {
        return ctx.body = 'waiting for compilation... refresh in a moment.'
    }
    try {
        const context = {url: ctx.url};
        // renderer.renderToString(context, (err, html) => {
        //     // 处理异常……
        //     ctx.body = (html)
        // })

        ctx.body=await renderer.renderToString(context);
    } catch (err) {
        throw err;
    }
});

router.post('/test2', async (ctx, next) => {
    const delay = new Promise(resolve => {
        setTimeout(function () {
            console.log("slow promise is done");
            resolve(10);
        }, 2000);
    });

    const time = await delay;

    ctx.body = {id: time};
    ctx.status = 200;
});

controller(router)
app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');
