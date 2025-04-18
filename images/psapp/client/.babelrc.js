module.exports = {
  parser: 'babel-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    babelOptions: {
      parserOpts: {
        plugins: ['jsx', 'ts', 'tsx']
      }
    }
  }
};