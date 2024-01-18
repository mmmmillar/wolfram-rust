const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  experiments: {
    asyncWebAssembly: true,
  },
  entry: {
    index: "./index.js",
    scroll: "./scroll.js",
    "3d": "./3d.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      template: "./scroll.html",
      filename: "scroll.html",
      chunks: ["scroll"],
    }),
    new HtmlWebpackPlugin({
      template: "./3d.html",
      filename: "3d.html",
      chunks: ["3d"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
