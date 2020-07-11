const wcommon = require('./webpack.common');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(wcommon, {
  mode: 'development', // Sets The Mode To development
  output: {
    filename: 'js/[name].js', // Output filename - [name] indicates property name in entry object
  },
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      // Copies HTML template from source and spits into output directory - This plugin automatically add src and href in script and link tags according to dist directory
      template: path.resolve(__dirname, 'src', 'index.html'), // HTML template to compose the output html from
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/i, // Setup for SCSS
        use: [
          'style-loader', // Injects css into style tags in head of html
          'css-loader', // convert css into JS
          'sass-loader', // Compiles Scss into css
        ],
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Setup for Images
        use: {
          loader: 'file-loader', // To load static files
          options: {
            name: '[folder]/[name].[ext]', // Naming options
          },
        },
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
      },
    ],
  },
});
