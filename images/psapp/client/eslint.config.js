// eslint.config.cjs
const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jest = require('eslint-plugin-jest');
const mocha = require('eslint-plugin-mocha');
const ban = require('eslint-plugin-ban');
const tsParser = require('@typescript-eslint/parser');
const globalsLib = require('globals');


module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {

        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react']
        },
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module',
        ecmaVersion: 'latest'
      },

      globals: {
        ...globalsLib.browser,
        ...globalsLib.node,
        ...globalsLib.jest,
        AbortSignal: 'readonly',
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'writable',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        wrapInRouter: 'readonly',
        wrapInProvider: 'readonly'
      }
    },
    plugins: {
      react,
      reactHooks,
      jest,
      mocha,
      ban
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'no-extra-boolean-cast': 'off',
      'react/jsx-no-undef': 'error',
      'no-undef': 'error',
      'no-useless-escape': 'error',
      'array-bracket-spacing': ['error', 'never'],
      'ban/ban': [
        'error',
        { name: 'fit', message: 'No fit allowed' },
        { name: 'xit', message: 'No xit allowed' },
        { name: 'fqit', message: 'No fqit allowed' },
        { name: 'qit', message: 'No quarantine tests allowed' },
        { name: 'fdescribe', message: 'No fdescribe allowed' }
      ],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'camelcase': ['error'],
      'comma-spacing': ['error'],
      'comma-style': ['error', 'last'],
      'curly': ['error', 'all'],
      'func-call-spacing': ['error', 'never'],
      'indent': ['error', 2, { SwitchCase: 1, MemberExpression: 2 }],
      'jsx-quotes': ['error', 'prefer-double'],
      'key-spacing': ['error', { mode: 'strict' }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'linebreak-style': ['error', 'unix'],
      'mocha/no-exclusive-tests': ['error'],
      'no-alert': ['error'],
      'no-lonely-if': ['error'],
      'no-return-await': ['error'],
      'no-trailing-spaces': ['error'],
      'no-unused-vars': [
        'error',
        { vars: 'all', args: 'none', ignoreRestSiblings: true }
      ],
      'object-curly-newline': ['error', { consistent: true }],
      'one-var': ['error', 'never'],
      'quotes': ['error', 'single'],
      'react/jsx-uses-vars': 'error',
      'require-await': ['error'],
      'semi': ['error', 'always'],
      'semi-spacing': ['error'],
      'semi-style': ['error', 'last'],
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': [
        'error',
        { anonymous: 'never', named: 'never', asyncArrow: 'always' }
      ],
      'space-in-parens': ['error', 'never'],
      'switch-colon-spacing': ['error'],
      'yoda': ['error'],
    }
  }
];
