const wcommon = require('./webpack.common');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

module.exports = merge(wcommon, {
  mode: 'production', // Sets The Mode To production
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/, // This cacheGroup would take all vendor code which is imported from node_modules and put it inside a file with name vendors (from name field)
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single', // Extract The runtime chunk so that our files hashes do not change
    moduleIds: 'hashed', // With this in place the modules which actually have changes will have their hashes changed, not others which usually change because of module ids when importing new modules
  },
  output: {
    filename: 'js/[name].[contentHash].js', // Output filename - [name] indicates property name in entry object
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contentHash].css',
    }),
    new HtmlWebpackPlugin({
      // Copies HTML template from source and spits into output directory - This plugin automatically add src and href in script and link tags according to dist directory
      template: path.resolve(__dirname, 'src', 'index.html'), // HTML template to compose the output html from
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/i, // Setup for SCSS
        use: [
          MiniCssExtractPlugin.loader, // Extract css into separate files in dist directory
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
            name: '[folder]/[name].[contentHash].[ext]', // Naming options
          },
        },
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
      },
    ],
  },
});
