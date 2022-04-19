const fs = require('fs')
const path = require('path')
const pathName = path.join(__dirname, './src/pages')
const files = fs.readdirSync(pathName)
const pages = []
for (let i = 0; i < files.length; i++) {
  const data = fs.statSync(path.join(pathName, files[i]))
  if (!data.isFile()) {
    pages.push(files[i])
  }
}
console.log(process.env.PAGE)
// process.env.PAGE = 'Closestool'
let _pages = {}
for (let i = 0; i < pages.length; i++) {
  _pages[pages[i]] = {
    entry: 'src/pages/' + pages[i] + '/main',
    template: 'public/index.html',
    filename: process.env.PAGE ? 'index.html' : pages[i] + '.html'
  }
}
// _pages.DeviceList = {
//   entry: 'src/pages/DeviceList/main.ts',
//   template: 'public/index.html',
//   filename: 'index.html'
// }
if (process.env.PAGE) {
  if (_pages[process.env.PAGE]) {
    _pages = {
      [process.env.PAGE]: _pages[process.env.PAGE]
    }
  }
  fs.writeFileSync('./env.json', `{ "PAGE":  "${process.env.PAGE}"}`)
}
module.exports = {
  productionSourceMap: false,
  publicPath: './',

  configureWebpack: {
    devtool: 'cheap-module-eval-source-map',
    externals: {
      echarts: 'echarts',
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      'vue-i18n': 'VueI18n'
    }
  },

  pages: _pages,

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#33D1FF'
        },
        javascriptEnabled: true
      },
      postcss: {
        plugins: [
          require('autoprefixer')({
            // 配置使用 autoprefixer
            overrideBrowserslist: ['last 15 versions']
          }),
          require('postcss-pxtorem')({
            rootValue: 37.5, // 设计稿375px
            // 忽略转换正则匹配项。插件会转化所有的样式的px。比如引入了三方UI，也会被转化。目前我使用 selectorBlackList字段，来过滤
            //如果个别地方不想转化px。可以简单的使用大写的 PX 或 Px 。
            selectorBlackList: ['ig'],
            propList: ['*'],
            exclude: /node_modules/
          })
        ]
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/less/theme.less')]
    }
  }
}
