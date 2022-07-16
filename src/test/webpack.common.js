const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const DotenvWebpack = require('dotenv-webpack');
const path = require('path');
// const PrettierPlugin = require('prettier-webpack-plugin');
const paths = require('./paths');

const { entry, htmlPlugins } = require('./util/getPageConfig');

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const threadLoader = require('thread-loader');

const jsWorkerPool = {
  workers: 2,
  poolTimeout: 2000,
};

threadLoader.warmup(jsWorkerPool, ['babel-loader']);

// webpackEnv: https://webpack.docschina.org/guides/environment-variables/
module.exports = (webpackEnv) => {
  return smp.wrap({
    // Where webpack looks to start building the bundle
    entry,

    // Where webpack outputs the assets and bundles
    output: {
      path: paths.build,
      filename: '[name].bundle.js',
      // publicPath: '/',
    },
    // cache:
    // Customize the webpack build process
    plugins: [
      // Removes/cleans build folders and unused assets when rebuilding
      new CleanWebpackPlugin(),

      // Generates an HTML file from a template
      // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
      ...htmlPlugins,

      // ESLint configuration
      new ESLintPlugin({
        files: ['.', 'src'],
        formatter: 'table',
      }),
      // dotenv
      new DotenvWebpack({
        path: paths.envPath, // 根据环境配置文件路径
        defaults: paths.defaultEnvPath,
      }),
      new webpack.DefinePlugin({
        'window.workEnv': JSON.stringify(process.env.APP_ENV),
        'process.env.subVersion': webpackEnv.subVersion,
      }),
      // MOMENT TRANSFROM DAYJS
      new AntdDayjsWebpackPlugin(),
      // code analyzer
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.STATS || 'disabled',
      }),
    ],

    // Determine how modules within the project are treated
    module: {
      rules: [
        // {
        //   test: /\.tsx?$/,
        //   use: [
        //     {
        //       loader: 'thread-loader',
        //       options: jsWorkerPool,
        //     },
        //     // 'cache-loader',
        //     // {
        //     //   loader: 'babel-loader',
        //     //   options: {
        //     //     cacheDirectory: true,
        //     //     presets: [
        //     //       ['@babel/preset-env'],
        //     //       [
        //     //         '@babel/preset-react',
        //     //         {
        //     //           runtime: 'automatic',
        //     //         },
        //     //       ],
        //     //       [
        //     //         '@babel/preset-typescript',
        //     //         {
        //     //           isTSX: true,
        //     //           allExtensions: true,
        //     //         },
        //     //       ],
        //     //     ],
        //     //     plugins: ['@babel/plugin-transform-runtime'],
        //     //   },
        //     // },
        //   ],
        //   exclude: /node_modules/,
        // },

        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        // { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader', exclude: /node_modules/ },
        // image
        {
          test: /\.(png|svg|jpg|jpeg|gif|mp3|wav)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'media/[hash][ext][query]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'font/[hash][ext][query]',
          },
        },
      ],
    },

    resolve: {
      modules: [paths.src, 'node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.json'],
      alias: {
        '@': paths.src,
        '@asset': path.resolve(paths.src, 'asset'),
        '@component': path.resolve(paths.src, 'component'),
        '@constant': path.resolve(paths.src, 'constant'),
        '@data': path.resolve(paths.src, 'data'),
        '@hook': path.resolve(paths.src, 'hook'),
        '@lib': path.resolve(paths.src, 'lib'),
        '@page': path.resolve(paths.src, 'page'),
        '@index': path.resolve(paths.src, 'page/index'),
        '@link': path.resolve(paths.src, 'page/link'),
        '@meeting': path.resolve(paths.src, 'page/meeting'),
        '@type': path.resolve(paths.src, 'type'),
        '@util': path.resolve(paths.src, 'util'),
        '@viewModel': path.resolve(paths.src, 'page/index/model/view-model'),
        '@businessModel': path.resolve(paths.src, 'page/index/model/business-model'),
      },
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
    },
  });
};
