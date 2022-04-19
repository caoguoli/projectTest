import Vue from 'vue'

import App from './App.vue'
import router from './router'
import 'amfe-flexible'
import '@/assets/less/init.less'
import i18n from '@/plugins/i18n'
import '@/plugins/mx'
import store from '@/store'
import Vconsole from 'vconsole';
new Vconsole()
Vue.config.productionTip = false

new Vue({
  i18n,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
