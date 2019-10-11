const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');


function fileLoader(outputFileName) {
    return {
        loader: 'url-loader',
        options: {
            limit: 10000,
            fallback: 'file-loader',
            outputPath: outputFileName,
            name() {
                if (devMode) {
                    return '[path][name].[ext]';
                }
                return '[name][hash].[ext]'
            }
        },
    }

}


module.exports = {
    mode: devMode ? 'development' : 'production',
    devtool: devMode ? 'cheap-eval-source-map' : 'none',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../'),
        },
        extensions: ['.js', '.css'],
        modules: [path.resolve(__dirname, "../src"), 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime'],
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader', 'sass-loader', 'postcss-loader'


                ]

            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: ['cache-loader', fileLoader('img')]

            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['cache-loader', fileLoader('font')]
            },

        ],
    },
    optimization: {},
    plugins: [
        new VueLoaderPlugin(),

        //new webpack.HotModuleReplacementPlugin()
    ],


}
