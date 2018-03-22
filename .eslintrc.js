module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  globals: {
    google: false
  },
  rules: {
    'no-unused-vars': [ "error", { argsIgnorePattern: '^_' } ]
  }
};
