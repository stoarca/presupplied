let path = require('path');
let webpack = require('webpack');
let TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    client: './src/index.tsx',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.wav$/,
        type: 'asset/resource',
        generator: {
          filename: '[name]-[hash][ext][query]',
        },
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../static/dist'),
  },
  devtool: 'source-map',
  node: {
    __filename: true,
    __dirname: true,
  },
};
