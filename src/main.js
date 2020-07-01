
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
//import axios from 'axios'
//import VueAxios from 'vue-axios'
import Element from 'element-ui'
//import htmlToPdf from '@/lib/htmlToPDF'
import Cookies from 'js-cookie'
import VueI18n from 'vue-i18n'
import messages from './lang/index'
//import request from '@/lib/request'
import utils from './lib/utils'
import myApi from './lib/apis/myApi'
import '@/assets/scss/element-variables.scss'
import '@/assets/scss/app.scss';

//Vue.config.productionTip = false
//Vue.use(VueAxios,axios);
Vue.use(Element);
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: Cookies.get('language') || 'zh', // 语言标识,
  messages: messages
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
Vue.prototype.$toolFn = utils;
Vue.prototype.$myApi = myApi;