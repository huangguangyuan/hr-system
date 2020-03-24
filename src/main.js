import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Element from 'element-ui'
import Utile from './lib/utils'
import myApi from './lib/apis/myApi'
import '@/assets/scss/element-variables.scss'
import '@/assets/scss/app.scss';
import htmlToPdf from '@/lib/htmlToPDF'
import Cookies from 'js-cookie'
import VueI18n from 'vue-i18n'
import messages from './lang/index'
import request from '@/lib/request'

//Vue.config.productionTip = false
Vue.use(VueAxios,axios);
Vue.use(Element);
Vue.use(Utile);
Vue.use(myApi);
Vue.use(htmlToPdf);
Vue.use(VueI18n)

// 使用多文件管理不同的语言是一个好习惯：
const i18n = new VueI18n({
  locale: 'zh', // 语言标识,
  locale: Cookies.get('language') || 'zh', // 语言标识,
  messages: messages
})
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
Vue.prototype.$toolFn = Utile;
Vue.prototype.$myApi = myApi;