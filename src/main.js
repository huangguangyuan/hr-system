import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Element from 'element-ui'
import Utile from './lib/utils'
import '@/assets/scss/element-variables.scss'
import '@/assets/scss/app.scss';

Vue.config.productionTip = false
Vue.use(VueAxios,axios);
Vue.use(Element)
Vue.use(Utile)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
