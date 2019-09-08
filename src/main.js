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

Vue.config.productionTip = false
Vue.use(VueAxios,axios);
Vue.use(Element);
Vue.use(Utile);
Vue.use(myApi);

let myVue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 配置全局token，设置axios拦截器
/* 请求拦截器 */
axios.interceptors.request.use(function (config) { // 每次请求时会从localStorage中获取token
  let userInfo = myVue.$toolFn.localGet('userInfo');
  if (userInfo && userInfo.token != "") {
    config.headers.common['token'] = userInfo.token;
  } else {
    sessionStorage.clear();
    localStorage.clear();
    // router.replace({
    //   path: '/' // 到登录页重新获取token
    // })
  }
  return config
}, function (error) {
  return Promise.reject(error)
});

// /* 响应拦截器 */
axios.interceptors.response.use(function (response) { // -1 token过期无效
  if (response.data.code === 109) {
      let userInfo = myVue.$toolFn.localGet('userInfo');
      myVue.$toolFn.localRemove('userInfo');
      let pathUrl = "/";
      if (userInfo.roleTypeId == 2 || userInfo.roleTypeId == 1){
        pathUrl ="/hr";
      }
      router.replace({
        path: pathUrl
      })
  }
  return response;
}, function (error) {
  console.log(error);
  return Promise.reject(error)
})