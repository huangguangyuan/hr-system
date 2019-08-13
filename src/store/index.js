import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import VuexPersistence from 'vuex-persistedstate'

Vue.use(Vuex);


let store = new Vuex.Store({
  modules: modules,
  plugins: [VuexPersistence({
    storage: window.sessionStorage,
    reducer(val) {
      return {
        addRoutes: val.addRoutes,
        accessModule: val.accessModule,
        staffModule:val.staffModule,
        BUModule:val.BUModule,
        payrollModule:val.payrollModule,
        wagesModule:val.wagesModule
      }
    }
  })]
});

//刷新加载的方法
const refresh = function () {
  //页面刷新重新加载路由
  store.dispatch('add_Routes_Fresh');
}
refresh();

export default store;
