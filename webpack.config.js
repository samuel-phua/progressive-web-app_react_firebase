var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: [
    "react-hot-loader/patch",
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server",
    "core-js/modules/es.promise",
    "core-js/modules/es.array.iterator",
    __dirname + "/src/index.js",
  ],
  output: {
    path: __dirname + "/public",
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-class-properties", "react-hot-loader/babel", "@babel/plugin-syntax-dynamic-import"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: __dirname + "/public/index.html",
    }),
  ],
  devServer: {
    contentBase: "./public",
    historyApiFallback: true,
    inline: true,
    hot: true,
  },
};
