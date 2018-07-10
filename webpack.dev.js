const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const path = require('path');


/**
 *
 * https://github.com/thomasthiebaud/react-kit/blob/master/config/webpack.config.js
 *
 *
 */


const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge.strategy(
  {
    'entry.app': 'prepend', // or 'replace', defaults to 'append'
    'module.rules': 'prepend',
    'plugins': 'append'
  }
)(commonConfig, {

  devtool: '#cheap-module-eval-source-map',

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public'),
    publicPath: '/',
  },
  plugins: [
      new ExtractTextPlugin({
          filename: '[name].css',
          allChunks: true
      }),
    new webpack.NamedModulesPlugin()
  ]
});



  console.log(module.exports.entry);
