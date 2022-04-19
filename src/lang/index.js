import zh from './zh-CN'
import en from './en'

const { pathname } = window.location
const PAGE_NAME =
  process.env.NODE_ENV !== 'production'
    ? pathname.replace(/(^\/)|(.html$)/g, '')
    : require('../../env.json').PAGE

let injectLang = {}
try {
  injectLang = require(`../../src/pages/${PAGE_NAME}/lang/index.js`).default
} catch (_) {
  console.warn('未找到多语言文件')
}

export default {
  en: {
    ...en,
    ...injectLang.en
  },
  'zh-CN': {
    ...zh,
    ...injectLang['zh-CN']
  }
}
