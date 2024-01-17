const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  experiments: {
    asyncWebAssembly: true,
  },
  entry: {
    index: "./index.js",
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
      template: "./3d.html",
      filename: "3d.html",
      chunks: ["3d"],
    }),
  ],
};
