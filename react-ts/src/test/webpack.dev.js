const webpack = require('webpack');
const { ProvidePlugin } = require('webpack');
const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const path = require('path');
const paths = require('./paths');
const getStyleLoaders = require('./util/getStyleLoaders').getStyleLoaders;
const caseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

const styleRegex = /\.(less|css)$/;
const moduleRegex = /\.module\.(less|css)$/;
const env = process.env.NODE_ENV;
module.exports = (...argv) => {
  return merge(common(...argv), {
    // Set the mode to development or production
    mode: 'development',

    // Control how source maps are generated
    devtool: 'eval-source-map',

    // Spin up a server for quick development
    devServer: {
      historyApiFallback: true,
      contentBase: paths.build,
      open: true,
      hot: true,
      host: '0.0.0.0',
      port: 8080,
      overlay: {
        warnings: true,
        errors: true,
      },
      proxy: {
        '/im': {
          target: `https://${process.env.SEEWO_IM_DOMAIN}`,
          changeOrigin: true,
          secure: true,
          pathRewrite: {
            '^/im': '',
          },
          bypass: (req, res, proxyOptions) => {
            // 请求路径是index.html

            if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
              console.log('Skipping proxy for browser request.');
              return '/index.html';
            }
          },
        },
        '/': {
          target: paths.proxy,
          // 如果后端服务托管在虚拟主机的时候，也就是一个IP对应多个域名，需要通过域名区分服务，那么参数changeOrigin必须为true(默认为false)，这样才会传递给后端正确的Host头，虚拟主机才能正确回应。否则http-proxy-middleware会原封不动将本地HTTP请求发往后端，包括Host: localhost而不是Host: httpbin.org，只有正确的Host才能使用虚拟主机，不然会返回404 Not Found。
          changeOrigin: true,
          secure: true,
          bypass: (req, res, proxyOptions) => {
            // 请求路径是index.html
            if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
              console.log('Skipping proxy for browser request.');
              return '/index.html';
            }
          },
        },
      },
      // disableHostCheck: true,
    },

    module: {
      rules: [
        // Styles: Inject CSS into the head with source maps
        {
          oneOf: [
            {
              test: moduleRegex,
              use: getStyleLoaders(env, {
                importLoaders: 1,
                modules: {
                  localIdentName: '[name]__[local]--[hash:base64:5]',
                },
              }),
            },
            {
              test: styleRegex,
              use: getStyleLoaders(env, {
                importLoaders: 1,
                modules: false,
              }),
            },
            {
              test: /\.(js|jsx|ts|tsx)?$/,
              use: [
                // 'cache-loader',
                {
                  loader: 'esbuild-loader',
                  options: {
                    loader: 'tsx',
                    target: 'es2015',
                    tsconfigRaw: require(path.resolve(__dirname, '../tsconfig.json')),
                  },
                },
              ],
              exclude: /node_modules/,
            },
          ],
        },
      ],
    },
    optimization: {
      // minimizer: [
      //   new ESBuildMinifyPlugin({
      //     target: 'es2015',
      //     css: true,
      //     minify: true,
      //     legalComments: 'none',
      //   }),
      // ],
      minimize: false,
      minimizer: [
        // Use esbuild to minify
        new ESBuildMinifyPlugin(),
      ],
    },
    plugins: [
      new ProvidePlugin({
        React: 'react',
      }),
      // Only update what has changed on hot reload
      new webpack.HotModuleReplacementPlugin(),
      new caseSensitivePathsPlugin(),
    ],
  });
};
