const path = require('path');
const webpack = require('webpack');

const resolve = (dir) => path.resolve(__dirname, dir); //dirname 目录路径

const CracoLessPlugin = require('craco-less');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();

// 去除sourceMap
// process.env.GENERATE_SOURCEMAP = "false";
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  webpack: smp.wrap({
    alias: {
      '@': resolve('src'),
      components: resolve('src/components'),
      pages: resolve('src/pages'),
      common: resolve('src/common'),
      services: resolve('src/services'),
      store: resolve('src/store'),
      utils: resolve('src/utils'),
    },
    configure: {
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: ['cache-loader', 'babel-loader'],
          },
          {
            test: /\.ts$/,
            exclude: /node_modules/,
            // 本质上是依赖于typescript(typescript compiler)
            use: ['cache-loader', 'babel-loader'],
          },
        ],
      },
    },
  }),
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          // 配置主题或者说是标志颜色
          lessOptions: {
            // modifyVars: { "@primary-color": "#1DA57A" },
            modifyVars: { '@primary-color': '#43a3ef' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
    compress: true,
    hotOnly: true, //错误修改后不刷新整个页面
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};
