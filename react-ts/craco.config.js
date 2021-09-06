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
    resolve: {
      modules: [
        // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
        resolve('src'),
        resolve('node_modules'),
      ],
      // 配置匹配文件后缀名eg:对于引入jsx文件，可以不填写后缀名也可以找到
      // extensions: [".wasm", ".mjs", ".js", ".json", ".jsx", ".ts", ".vue"],
      alias: {
        '@': resolve('src'), // 缓存src目录为@符号，避免重复寻址
        pages: resolve('./src/pages'),
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
    // {
    //   plugin: new ReactRefreshWebpackPlugin(),
    // },
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
