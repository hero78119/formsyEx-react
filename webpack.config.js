"use strict"

var
  ENVIRONMENT = process.env.NODE_ENV || "development",
  path = require("path"),
  webpack = require("webpack"),
  ReactStylePlugin = require('react-style-webpack-plugin'),
  // ReactStylePlugin = require('react-style/lib/webpack'),
  entry = {},
  config;

config = {
  devtool: "eval",
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  entry: './Test.jsx',
  module: {
    loaders: [],
    noParse: /\.min\.js/
  },
  output: {
    path: path.join(__dirname, "static/js"),
    publicPath: "/",
    filename: "[name].js",
    chunkFilename: "[chunkhash].js",
    sourceMapFilename: "debugging/[file].map",
    hotUpdateChunkFilename: "hot/[id].[hash].hot-update.js",
    hotUpdateMainFilename: "hot/[hash].hot-update.json",
     // export itself to a global var
    libraryTarget: "var",
    // name of the global var: "Foo"
    library: "Fluxex"
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // To enable production mode:
        // NODE_ENV: JSON.stringify('production')
      }
    })
    // new ReactStylePlugin('bundle.css'),
  ],
  remarkable: {
    html: true,
    preset: "full",
    linkify: true,
    typographer: true
  },
  resolve: {
    modulesDirectories: [
      "app",
      "node_modules",
      "web_modules"
    ],
    extensions: [
      "",
      ".js",
      ".jsx",
      ".json"
    ],
    alias: {

    }
  }
}

config.module.loaders.push(
  {test: /\.png$/,  loader: "url-loader?prefix=img/&limit=8192"},
  {test: /\.html$/,  loader: "html-loader"},
  {test: /\.svg$/,  loader: "url-loader?mimetype=image/svg+xml"},
  {test: /\.jpg$/,  loader: "url-loader?prefix=img/&limit=8192"},
  {test: /\.gif$/,  loader: "url-loader?prefix=img/&limit=8192"},
  {test: /\.woff$/, loader: "url-loader?prefix=font/&limit=8192"},
  {test: /\.eot$/,  loader: "file-loader?prefix=font/"},
  {test: /\.ttf$/,  loader: "file-loader?prefix=font/"},
  {test: /\.md$/,   loader: "html!remarkable"},
  {test: /\.json$/, loader: "json-loader"},
  {test: /\.js$/,   loader: "babel-loader?optional=runtime", exclude: [/node_modules/]}
)

var JSXconfig = {test: /\.jsx$/,  loaders: ["babel-loader", "jsx-loader?harmony", ReactStylePlugin.loader()], exclude: [/node_modules/]}

if (ENVIRONMENT === "development") {
  config.cache = true
  config.debug = true
  config.devtool = "eval"

  /*config.entry[bundleName].push(
    "webpack-dev-server/client?http://0.0.0.0:8082",
    "webpack/hot/only-dev-server"
  )*/

  config.devServer = {
    contentBase: "./dist/"
  }

  // JSXconfig.loaders.unshift("react-hot")

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
}
config.module.loaders.push(JSXconfig)
config.module.loaders.push({
                                  test: /\.jsx$/,
                                  loader: ReactStylePlugin.loader()
                            },
                            {
                                  test: /\.js$/,
                                  loader: ReactStylePlugin.loader()
                            })
module.exports = config
