const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "index.js",
    library: "reactRouterTyped",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        use: "awesome-typescript-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
    'react-router': {
      root: "react-router",
      commonjs2: "react-router",
      commonjs: "react-router",
      amd: "react-router",
    },
  },
  devtool: process.env.NODE_ENV === 'development'  && "source-map",
  mode: process.env.NODE_ENV,
  optimization: {
    minimize: process.env.NODE_ENV === 'production'
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "src/types/",
        to: "./types",
      },
    ]),
  ],
};
