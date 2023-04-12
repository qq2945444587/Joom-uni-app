'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const spinner = ora('building for production...')
spinner.start()


const HtmlWebpackPlugin = require('html-webpack-plugin')

const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

new HtmlWebpackPlugin({
    filename: config.build.index,
    template: 'index.html',
    inject: true,
    minify: {
      removeComments: false, // 改为false
      collapseWhitespace: false, // 改为false
      removeAttributeQuotes: false // 改为false
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
  }),
  new OptimizeCSSPlugin({
    cssProcessorOptions: config.build.productionSourceMap ?
      {
        safe: true,
        map: {
          inline: false
        }
      } :
      {
        safe: true
      }
  }),

  new UglifyJsPlugin({
    uglifyOptions: {
      compress: {
        warnings: false
      }
    },
    sourceMap: config.build.productionSourceMap,
    parallel: true
  }),

  rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, (err, stats) => {
      spinner.stop()
      if (err) throw err
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
        chunks: false,
        chunkModules: false
      }) + '\n\n')

      if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
      }

      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
  })
