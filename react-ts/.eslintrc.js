/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-10-14 15:18:57
 * @LastEditors: camus
 * @LastEditTime: 2021-10-14 15:18:58
 */
module.exports = {
  globals: {
    __dirname: true,
    process: true,
    VoidFunction: true,
  },
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  // extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  extends: ['alloy', 'alloy/react', 'alloy/typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/prop-types': 0,
    'react/display-name': 0,
    '@typescript-eslint/no-var-requires': 0,
    'react/react-in-jsx-scope': 'off',
    // allow jsx syntax in js files (for next.js project)
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
    '@typescript-eslint/no-require-imports': 0, // 是否允许require()导入
    // 'no-require-imports': 0,
  },
};
