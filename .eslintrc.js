module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    // 'plugin:vue/essential',
    // '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0,
    semi: ['error', 'always'], // 要求使用分号结束
    quotes: ['error', 'single'], // 强制单引号
    indent: ['error', 2], // 代码缩进4
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never'
    }],
    'generator-star-spacing': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
