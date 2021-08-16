module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es2020: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-empty-interface': "off"
  }
}
