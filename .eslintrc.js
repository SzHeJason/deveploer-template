module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es2020: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off"
  }
}
