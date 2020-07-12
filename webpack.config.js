const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const htmlPath = path.resolve(__dirname, 'src', 'html')
const entryPath = path.resolve(__dirname, 'src', 'entry')

module.exports = (webpackEnv) => {
  // Setup "production" as default mode if --env.mode is not provided
  let env = webpackEnv;
  if (!env) {
    env = {};
    env.mode = 'production';
  } else if (env && !env.mode) {
    env.mode = 'production';
  }

  // Mode
  const { mode } = env;

  // Entry
  const entry = {
    main: `${entryPath}/index.js`,
  };

  // Ouput
  const output = {
    path: path.resolve(__dirname, 'dist'),
    filename:
      mode === 'development' ? `js/[name].js` : `js/[name].[contentHash].js`,
  };

  // Plugins
  const plugins = [new CleanWebpackPlugin({ cleanStaleWebpackAssets: false })];
  if (mode === 'development') {
    plugins.push(
      new HtmlWebpackPlugin({
        template: `${htmlPath}/index.html`,
        filename: 'index.html',
        chunks: ['main'],
      })
    );
  }
  if (mode === 'production') {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: `css/[name].[contentHash].css`,
      }),
      new HtmlWebpackPlugin({
        template: `${htmlPath}/index.html`,
        filename: 'index.html',
        chunks: ['main'],
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
      })
    );
  }

  // Module
  const module = {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.html$/i,
        use: 'html-loader',
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
      },
    ],
  };

  if (mode === 'development') {
    module.rules.push(
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: `[folder]/[name].[ext]`,
          },
        },
        exclude: /node_modules/,
      }
    );
  }

  if (mode === 'production') {
    module.rules.push(
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: `[folder]/[name].[contentHash].[ext]`,
          },
        },
        exclude: /node_modules/,
      }
    );
  }

  // Config
  const config = {
    // Mode
    mode,

    // Entry
    entry,

    // Output
    output,

    // Plugins
    plugins,

    // Module
    module,
  };

  // Everything else that's needed in Development Mode
  // Devtool
  if (mode === 'development') {
    config.devtool = 'eval-cheap-module-source-map';
  }

  // Everything else that's needed in Production Mode
  // Optimization
  if (mode === 'production') {
    config.optimization = {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
      runtimeChunk: 'single',
      moduleIds: 'hashed',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(currentModule) {
              const packageName = currentModule.context
                .match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                .replace('@', '-');

              return `npm.${packageName}`;
            },
            chunks: 'all',
          },
        },
      },
    };
  }

  return config;
};
