const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    publicPath: '/',
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: './dist',
    hot: true,
  },
});