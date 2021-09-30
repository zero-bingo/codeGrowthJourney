module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // false 不对当前js处理做polyfill填充
        // usage 依据源代码按需加载polyfill填充
        useBuiltIns: 'usage',
        corejs: 3
        // entry 依据浏览器加载polyfill填充 && 需要importcore-js regenerator-runtime
        // useBuiltIns: 'entry',
        // corejs: 3
      }
    ],
    // ['@babel/preset-react']
  ]
}