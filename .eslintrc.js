/* eslint-disable sort-keys */
module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12
  },
  'rules': {
    'comma-style': ['error', 'last'],
    'curly': ['error'],
    'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
    'indent': ['error', 2],
    'max-lines': ['error', {
      'max': 180,
      'skipBlankLines': true,
      'skipComments': true,
    }],
    'no-promise-executor-return': ['error'],
    'no-console': ['error', { allow: ['warn'] }],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'sort-keys': [
      'error', 'asc', {
        'caseSensitive': true,
        'natural': false,
      }
    ]
  }
};
