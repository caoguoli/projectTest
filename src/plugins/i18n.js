import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/lang'

Vue.use(VueI18n)

const lang = window.navigator.userAgent.match(/lang\/(\S+)/)
let locale = 'zh-CN'
if (lang && lang[1]) {
  // 兼容zh
  locale = lang[1]
}

// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
  locale, // 设置地区
  messages, // 设置地区信息
  fallbackLocale: 'zh-CN'
})

export default i18n
