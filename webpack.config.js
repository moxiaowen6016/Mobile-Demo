const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].[contenthash:8].js',
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]] } } },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  resolve: { extensions: ['.js', '.jsx'] },
  plugins: [new HtmlWebpackPlugin({ template: './public/index.html' })],
  devServer: { historyApiFallback: true, hot: true, client: { overlay: true } },
  performance: { hints: false }
};
