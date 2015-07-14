"use strict"
var path = require('path');

module.exports = {

  devtool: 'inline-source-map',

  entry: path.resolve(__dirname, 'build', 'Test.jsx'),

  output: {
    path: path.resolve(__dirname, 'static', 'js'),
    filename: 'main.js'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.jsx$/,  loaders: ["babel-loader", "jsx-loader?harmony"], exclude: [/node_modules/]}
    ]
  }
};
