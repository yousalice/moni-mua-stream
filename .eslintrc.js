/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  env: {
    es2021: true,
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  globals: {
    __static: true,
    __windowUrls: true,
    __preloads: true,
    __workers: true,
    NodeJS: true,
    __IS_MONI__: true
  },
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'space-before-function-paren': 0,
    'vue/no-multiple-template-root': 0,
    'import/no-absolute-path': 0
  },
  ignorePatterns: [
    'node_modules/**',
    'dist/**',
    'scripts/**',
    'build/**'
  ]
}
