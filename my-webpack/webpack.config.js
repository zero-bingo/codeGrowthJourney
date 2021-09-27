const path = require('path')
const { DefinePlugin } = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // assetModuleFilename: 'img/[name].[hash:10][ext]'
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
        // use: [{
        //   // loader: 'file-loader', // 将资源文件提取出来
        //   loader: 'url-loader', // 转化为inline行代码，base64位等，减少请求资源
        //   options: {
        //     esModule: false, // file-loader在识别文件资源时 最后webpack5 会默认导出成esModule对象的形式
        //     name: 'img/[name].[hash:10].[ext]',
        //     // outputPath: 'img',
        //     limit: 25 * 1024
        //   }
        // }]
        // 在webpack中 不必配置loader了
        // type: 'asset/resource', // 相当于 file-loader
        // generator: {
        //   filename: 'img/[name].[hash:10][ext]'
        // }
        // type: 'asset/inline', // 相当于 url-loader
        type: 'asset', // 相当于webpack老版本的融合写法
        generator: {
          filename: 'img/[name].[hash:10][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024
          }
        }
      },
      {
        test: /\.(ttf|woff2?)$/,
        type: 'asset/resource', // 相当于webpack老版本的融合写法
        generator: {
          filename: 'font/[name].[hash:3][ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new DefinePlugin({
      BASE_URL: '"./"'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    })
  ]
}