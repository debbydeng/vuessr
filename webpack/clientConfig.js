const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./baseConfig');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';

module.exports = merge(baseConfig, {
    entry: {
        app: './entry-client.js',
    },
    output: {
        filename: '[name].[chunk].js',
        path: path.resolve(__dirname, '../dist'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    priority: -20,
                    reuseExistingChunk: true
                },

            },
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        // 此插件在输出目录中
        // 生成 `vue-ssr-client-manifest.json`。
        new VueSSRClientPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../index.template.html")
        }),
        // 将依赖模块提取到 vendor chunk 以获得更好的缓存，是很常见的做法。

    ]
})
