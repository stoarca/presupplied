module.exports = {
  parser: 'babel-eslint-parser',
  presets: ['@babel/preset-react', '@babel/preset-env'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    babelOptions: {
      parserOpts: {
        plugins: ['jsx', 'ts', 'tsx']
      }
    }
  },
  env: {
    browser: true,
    node: true,
  }
};