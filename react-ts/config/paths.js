const path = require('path');

// 环境变量配置
const envConfigPath = {
  dev: path.resolve(__dirname, '../src/config/.env.dev'), // 开发环境配置
  staging: path.resolve(__dirname, '../src/config/.env.staging'), // 测试环境配置
  prod: path.resolve(__dirname, '../src/config/.env.prod'), // 正式环境配置
};

module.exports = {
  // Source files
  src: path.resolve(__dirname, '../src'),
  // Static files that get copied to build folder
  public: path.resolve(__dirname, '../public'),
  // 默认文件
  defaultEnvPath: path.resolve(__dirname, '../src/config/.env'),
};
