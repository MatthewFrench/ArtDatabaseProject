let nodeExternals = require('webpack-node-externals');
let webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: {server: "./main.js", unittests:"./Unit Tests/run.js"},
    target: 'node',
    output: {
        path: __dirname + '/Build/',
        filename: "./[name].js",
        libraryTarget: 'commonjs2'
    },
    devtool: 'source-map',
    externals: [nodeExternals()],
    module: {
        rules: [
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
            }]
    },
    plugins: [new webpack.BannerPlugin({ banner: 'require("source-map-support").install({environment: \'node\', hookRequire: true});',
        raw: true, entryOnly: false })]
};