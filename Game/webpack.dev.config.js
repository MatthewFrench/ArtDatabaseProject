let HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    context: __dirname,
    entry: "./main.js",
    output: {
        path: __dirname + '/Build/',
        filename: "./bundle.js"
    },
    devtool: 'source-map',
    devServer: {
        overlay: true
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        },
            {
                test: /\.(jpg|png|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]

            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015'],
                        plugins: ['transform-class-properties']
                    }
                }
            },
            {
                test: /\.glsl$/,
                loader: 'webpack-glsl-loader'
            }]
    },
    plugins: [new HtmlWebpackPlugin()]
};