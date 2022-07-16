const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

const paths = require('./paths');
const common = require('./webpack.common.js');
const getStyleLoaders = require('./util/getStyleLoaders').getStyleLoaders;

const styleRegex = /\.(less|css)$/;
const moduleRegex = /\.module\.(less|css)$/;
const env = process.env.NODE_ENV;
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const customServiceWorkerFileName = 'service-worker-custom.js';
const serviceWorkerCustomPath = path.join(__dirname, `../src/lib/ServiceWorker/${customServiceWorkerFileName}`);

module.exports = (...argv) => {
  const webpackEnv = argv[0];
  return merge(common(...argv), {
    mode: 'production',
    devtool: false,
    output: {
      path: webpackEnv.outputPath || paths.build,
      // publicPath: '/',
      filename: 'js/[name].[contenthash].bundle.js',
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: moduleRegex,
              use: getStyleLoaders(env, { importLoaders: 2, modules: true }),
            },
            {
              test: styleRegex,
              use: getStyleLoaders(env, { importLoaders: 2, modules: false }),
            },
          ],
        },
      ],
    },
    plugins: [
      // Extracts CSS into separate files
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash].css',
        chunkFilename: 'styles/[name].[contenthash].css',
      }),
      new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        importScripts: [customServiceWorkerFileName],
      }),
      new CopyPlugin({
        patterns: [{ from: serviceWorkerCustomPath, to: paths.build }],
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({ parallel: 4, include: paths.src, exclude: /\/node_modules/ }),
        new CssMinimizerPlugin(),
        '...',
      ],
      runtimeChunk: {
        name: 'runtime',
      },
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  });
};
