const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
const commonConfig = require('./webpack.common.js');
const path = require('path');


/**
 *
 * cleanup, etc...
 * https://github.com/alicoding/react-webpack-babel/blob/master/webpack.production.config.js
 *
 */

const DIST_PATH =  '../layer_manager_api/client/public';

module.exports = merge.strategy(
  {
    'module.rules': 'prepend',
    'plugins': 'append'
  }
)(commonConfig, {
  devtool: 'source-map',
  output: {
    // path: path.join(process.cwd(), '/dist'),
    path: path.join(__dirname, DIST_PATH),
    publicPath: '/',
    filename: '[name].[hash].js'
  },
  plugins: [
    // new CleanWebpackPlugin([DIST_PATH], {allowExternal: true}),
    // new webpack.optimize.ModuleConcatenationPlugin(),
    // new WebpackBundleSizeAnalyzerPlugin('./bundle.txt'),
    // new webpack.NoErrorsPlugin(),
    // new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin("[name].[hash].css"),
    new webpack.optimize.UglifyJsPlugin({
      // sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
        // except: ['$super']
      },
      compress: {
        screw_ie8: true,
        warnings: false
      },
      comments: false,
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: true
    }),

  ]
});
