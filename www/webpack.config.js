const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const data = require("./data.json");

module.exports = (env, argv) => {
  return {
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
      new CopyWebpackPlugin({
        patterns: [
          { from: "./3d.html", to: "3d.html" },
          { from: "assets", to: "assets" },
          { from: "styles.css", to: "styles.css" },
        ],
      }),
      new HtmlWebpackPlugin({
        template: "./templates/index.hbs",
        filename: "index.html",
        inject: false,
        templateParameters: data.index,
      }),
      new HtmlWebpackPlugin({
        template: "./templates/automata.hbs",
        filename: "cellular_automata.html",
        inject: false,
        templateParameters: data.automata,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.hbs$/,
          loader: "handlebars-loader",
          options: {
            helperDirs: path.resolve(__dirname, "helpers"),
          },
        },
      ],
    },
  };
};
