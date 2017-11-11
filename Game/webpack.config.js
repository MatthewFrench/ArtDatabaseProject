let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./Javascript/main.js",
  output: {
    path: __dirname,
    filename: "./Build/bundle.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" }
    ]
  },
  plugins: [new HtmlWebpackPlugin()]
};