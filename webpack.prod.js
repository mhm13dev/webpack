const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: 'production', // Sets The Mode To production
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    runtimeChunk: 'single', // Extract The runtime chunk so that our files hashes do not change
    moduleIds: 'hashed', // With this in place the modules which actually have changes will have their hashes changed, not others which usually change because of module ids when importing new modules
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        // vendor: {
        //   test: /[\\/]node_modules[\\/]/, // This cacheGroup would take all vendor codewhich contains "node_modules" in their path and put it inside a file with name vendors (from name field)
        //   name: 'vendors',
        //   chunks: 'all',
        // },

        vendor: {
          // This cacheGroup would take all vendor codewhich contains "node_modules" in their path and put it inside different files based on name from name function
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context
              .match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              .replace('@', '-');

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName}`;
          },
          chunks: 'all',
        },
        // split: {
        //   // This cacheGroup would take all code which contains "split" in their path and put it inside different files based on name from name function
        //   test: /[\\/]split[\\/]/,
        //   name(module, chunks) {
        //     // const name = module
        //     //   .identifier()
        //     //   .split(path.sep)
        //     //   .reduceRight((item) => item)
        //     const name = module.resource.match(
        //       /[\\/]split[\\/](.*?)([\\/]|\.|$)/
        //     )[1];
        //     return `split.${name}`;
        //   },
        //   chunks: 'all',
        // },
      },
    },
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
      chunks: ['main'], // Name of Chunks to include in HTML file
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
