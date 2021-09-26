const path = require()

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1, // 遇见import 需要回退执行loader的数量
              esModule: false // css-loader在识别background-url时 会默认采用require方式导入，然后配合webpack5 会导出成esModule对象的形式
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              esModule: false
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        use: [{
          // loader: 'file-loader',
          loader: 'url-loader',
          options: {
            esModule: false, // file-loader在识别文件资源时 最后webpack5 会默认导出成esModule对象的形式
            name: 'img/[name].[hash:10].[ext]',
            // outputPath: 'img',
            limit: 25 * 1024
          }
        }]
      }
    ]
  }
}