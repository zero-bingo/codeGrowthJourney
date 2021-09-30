const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')

const app = express()

const config = require('./webpack.config')
const compiler = webpack(config)

app
  .use(webpackDevMiddleware(compiler))
  .use(require("webpack-hot-middleware")(compiler));

app.listen(3000, () => {
  console.log('serve is running at 3000 port')
})