const path=require('path');
const merge=require('webpack-merge');
const nodeExternals=require('webpack-node-externals');
const baseConfig=require('./baseConfig');
const VueSSRServerPlugin=require('vue-server-renderer/server-plugin');

module.exports=merge(baseConfig,{
    entry:'./entry-server.js',
    target:'node',
    output:{
        libraryTarget:'commonjs2',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: 'server.js'
    },
    externals:nodeExternals({
        whitelist:/\.css$/
    }),
    plugins:[
        new VueSSRServerPlugin
    ]
})
