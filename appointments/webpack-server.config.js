const path = require("path");
const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "development",
  target: "node",
  entry: {
    app: ["./server/src/server.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist/server/"),
    filename: "server.js"
  },
  externals: [nodeExternals()],
  module: {
    rules: [{
      test: /\.js|$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },{
      test: /\.graphql$/,
      exclude: /node_modules/,
      loader: 'raw-loader'
    }]}
};
