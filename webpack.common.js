const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: ['./src/index.js'], // Multiple Entry Files can be specified in this Object
    another: ['./src/another.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Output Directory
  },
  plugins: [new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.html$/i, // Setup For HTML Files
        use: 'html-loader', // Load HTML in to JS and automatically add src attributes according to the dist directory
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
      },
    ],
  },
};
