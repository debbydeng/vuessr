const fs = require('fs');
const path = require('path');
const MFS = require('memory-fs');
const webpack = require('webpack');
const chokidar = require('chokidar');

const clientConfig = require('./clientConfig');
const serverConfig = require('./serverConfig');

const readFile = (fs, file) => {
    try {
        return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8');
    } catch (e) {
        console.log(e)
    }
}


module.exports = async function setupDevServer(app, templatePath, cb) {
    let bundle, template, clientManifest, ready;
    const readyPromise = new Promise(r => {
        ready = r
    });
    const update = () => {
        if (bundle && clientManifest) {
            ready();
            cb(bundle, {
                template,
                clientManifest
            })
        }
    };

    template = fs.readFileSync(templatePath, 'utf-8');
    chokidar.watch(templatePath).on('change', () => {
        template = fs.readFileSync(templatePath, 'uft-8');
        console.log('index.html template updated.');
        update();
    });

    //modify client config to work with hot middleware
    clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
    clientConfig.output.filename = '[name].js'
    clientConfig.plugins.push(
       // new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )

    const clientCompiler = webpack(clientConfig)
    // KOA2 使用express plugin:webpack-dev-middleware,webpack-hot-middleware需要将其封装下，所以直接使用koa-webpack
    // const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    //     publicPath: clientConfi
    // g.output.path,
    //     noInfo: true
    // })
    const devMiddleware = await require('koa-webpack')(
        {
            compiler: clientCompiler,
            config:Object.assign(clientConfig,{serverSideRender:true}),
            devMiddleware:{
                publicPath:clientConfig.output.path,
                noInfo:true
            },
        });
    app.use(devMiddleware)

    clientCompiler.plugin('done', stats => {
        stats = stats.toJson()
        stats.errors.forEach(err => console.error(err));
        stats.warnings.forEach(err => console.warn(err));
        try{
            if (stats.errors.length) return
            clientManifest = JSON.parse(readFile(
            devMiddleware.devMiddleware.fileSystem,
                'vue-ssr-client-manifest.json'
            ))
        }catch (e) {
            throw e;
        }

        update()
    })


    // hot middleware
  //  app.use(require('webpack-hot-middleware')(clientCompiler, {heartbeat: 5000}))

    // watch and update server renderer
    const serverCompiler = webpack(serverConfig)
    const mfs = new MFS()
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err, stats) => {
        if (err) throw err
        stats = stats.toJson()
        if (stats.errors.length) return

        // read bundle generated by vue-ssr-webpack-plugin
        bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
        update()
    })

    return readyPromise
}
