var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker');

var config = require('./webpack.base.config.js');

config.output.path = require('path').resolve('./assets/dist');

config.plugins = config.plugins.concat([
  new BundleTracker({filename: './webpack-stats-prod.json'}),

  // removes a lot of debugging code in React
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
  }}),

  // keeps hashes consistent between compilations
  new webpack.optimize.OccurrenceOrderPlugin(),

  // minifies your code
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  })
])

// Add a loader for JSX files
config.module.rules.push(
  { 
    test: /\.jsx?$/, 
    exclude: /node_modules/, 
    loader: 'babel-loader' 
  }
)

module.exports = config;