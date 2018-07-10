const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');


const DEV_API_PORT = 3007;
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';


const NODE_ENV = process.env.NODE_ENV || 'production';
const isProduction = (NODE_ENV === 'production');
const isDevelopment = (NODE_ENV === 'development');


/**
 *
 * Prod tips https://medium.com/netscape/webpack-3-react-production-build-tips-d20507dba99a
 *
 *
 */

module.exports = {
  // context: path.resolve(__dirname, 'app'),
  entry: {
    'vendor': './assets/vendor.js',
    'app': ['./assets/app.js']
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        // exclude: /node_modules/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'fonts/'
          }
        }]
      },
      {
        test: /\.(jsx|js)/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [['es2015', {modules: false}]],
          },
        }],
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
        basePath: JSON.stringify(null)
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // new HtmlWebpackPlugin({
    //   template: 'app/index.html',
    //   baseUrl: process.env.NODE_ENV === 'development' ? '/' : '/',
    // }),

    new CopyWebpackPlugin([
      {
        from: 'assets/img',
        to: 'img',
      },
      {
        from: 'assets/js-vendor',
        to: 'js',
      },
      // {
      //   from: 'favicon.ico',
      //   to: 'favicon.ico',
      //   context: path.join(__dirname, 'app')
      // },
    ]),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   "window.jQuery": "jquery",
    //   Popper: 'popper.js'
    // }),
    // new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/)
  ],

  devServer: {
    host: HOST,
    port: PORT,
  }
};
