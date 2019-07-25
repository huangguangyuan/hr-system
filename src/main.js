import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Element from 'element-ui'
import Qs from 'qs'
import Utile from './lib/utils'
import '@/assets/scss/element-variables.scss'
import '@/assets/scss/app.scss';

Vue.config.productionTip = false
Vue.use(VueAxios,axios);
Vue.use(Element)
Vue.use(Utile)

Vue.prototype.$qs = Qs;

let myVue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 配置全局token，设置axios拦截器
/* 请求拦截器 */
axios.interceptors.request.use(function (config) { // 每次请求时会从localStorage中获取token
  let token = myVue.$toolFn.localGet('userInfo').token;
  if (token) {
    config.headers.common['token'] = token;
  } else {
    router.replace({
      path: '/' // 到登录页重新获取token
    })
  }
  return config
}, function (error) {
  return Promise.reject(error)
});

// /* 响应拦截器 */
axios.interceptors.response.use(function (response) { // -1 token过期无效
  // if (response.data.result === -1) {}
  return response;
}, function (error) {
  if (error.response.code === 109) {
    myVue.$toolFn.localRemove('token');// 删除已经失效或过期的token（不删除也可以，因为登录后覆盖）
    router.replace({
      path: '/' // 到登录页重新获取token
    })
  }
  return Promise.reject(error)
})

// axios.defaults.headers.common['token'] = myVue.$toolFn.localGet('token');


