import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex);


let store = new Vuex.Store({
  modules:modules
});

export default store;
