let HtmlWebpackPlugin = require('html-webpack-plugin');

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
      }]
  },
  plugins: [new HtmlWebpackPlugin()]
};