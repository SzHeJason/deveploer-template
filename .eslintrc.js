module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: ['standard', 'plugin:prettier/recommended'],
  rules: {},
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      extends: [
        'standard',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
      plugins: ['@typescript-eslint'],
      rules: {
        /**
         * 请勿随意修改规则
         */
        // 允许显式any声明
        '@typescript-eslint/no-explicit-any': 'off',
        // 关闭显式function返回类型声明
        '@typescript-eslint/explicit-function-return-type': 'off',
        // 允许使用三斜线依赖引入声明文件
        '@typescript-eslint/triple-slash-reference': 'off',
        // 允许声明空的接口
        '@typescript-eslint/no-empty-interface': 'off',
        // 禁止声明未使用变量
        '@typescript-eslint/no-unused-vars': 'error',
        // 允许提前使用未声明变量
        '@typescript-eslint/no-use-before-define': 'off',
        // 允许非null断言
        '@typescript-eslint/no-non-null-assertion': 'off',
        // 允许函数不显示返回类型
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        //
        '@typescript-eslint/no-floating-promises': 'off',
      },
    },
  ],
}
