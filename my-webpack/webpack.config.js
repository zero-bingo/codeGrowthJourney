const path = require('path')
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  // entry: [
  //   './src/index.js',
  //   // 'webpack-hot-middleware/client'
  // ],
  entry: {
    main1: './src/main1.js',
    main2: {
      import: './src/main2.js',
      dependOn: 'lodash'
    },
    lodash: 'lodash'
  },
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // assetModuleFilename: 'img/[name].[hash:10][ext]',
    publicPath: './' // 打包后index.html的资源引用路径 = 域名+publicPath+filename
  },
  devServer: {
    hot: true,
    hotOnly: true,
    port: 4000,
    // open: true,
    compress: true,
    publicPath: './', // 指定本地服务所在的虚拟目录（本地打包是放在内存中的）
    // contentBase: path.resolve(__dirname, 'public'), // 依赖的非经过打包的资源路径
    // watchContentBase: true,
    proxy: {
      '/api': {
        target: 'https://api.github.com',
        pathRewrite: {'^/api': ''},
        changeOrigin: true
      }
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.json'],
    // mainFiles: ['index'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
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
              importLoaders: 2,
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
        // 在webpack5中 不必配置loader了
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
      },
      {
        test: /\.js$/,
        // use: [
        //   {
        //     loader: 'babel-loader',
        //     options: {
        //       // plugins: []
        //       presets: [
        //         [
        //           '@babel/preset-env',
        //           // {targets: 'chrome 91'}, // 兼容权重优先级大于browserslistrc
        //         ]
        //       ]
        //     }
        //   }
        // ]
        use: ['babel-loader'] // 利用babel.config.js详细配置
      },
      // {
      //   test: /\.jsx?$/,
      //   use: ['babel-loader']
      // },
      {
        test: /\.ts$/,
        use: ['babel-loader']
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // title: '1321',
      template: './public/index.html'
    }),
    new DefinePlugin({
      BASE_URL: '"./"'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/*',
          to: '[name].[ext]',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/*.html']
          }
        }
      ]
    }),
    // new HotModuleReplacementPlugin(),
  ]
}