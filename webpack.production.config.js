"use strict"
var path = require('path');

module.exports = {

  devtool: 'inline-source-map',

  entry: path.resolve(__dirname, 'lib', 'main.js'),
  externals: ['react', 'underscore'],

  output: {
    path: path.resolve(__dirname, 'release'),
    filename: 'formsyEx-react.js',
    libraryTarget: 'umd',
    library: 'FormsyEx'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.json$/, loader: 'json' },
      { test: /\.jsx$/,  loaders: ["babel-loader", "jsx-loader?harmony"], exclude: [/node_modules/]}
    ]
  }

};
