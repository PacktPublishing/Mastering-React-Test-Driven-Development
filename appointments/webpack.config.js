const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry:  path.join(__dirname, "src", "index.js"),
  output: { path: path.resolve(__dirname, "dist"),filename: 'bundle.js', },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
    }),
  ],
  mode: 'development',
  resolve: {
    extensions: [".js", ".jsx", "scss"],
    modules: [
      "node_modules",
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "styles"),
      path.resolve(__dirname, "assets"),
    ]
  
  }, 
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};