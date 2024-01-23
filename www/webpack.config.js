const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
          { from: "./index.html", to: "index.html" },
          { from: "./3d.html", to: "3d.html" },
          { from: "assets", to: "assets" },
          { from: "styles.css", to: "styles.css" },
        ],
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
};
