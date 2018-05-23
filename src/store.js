import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoaded: false
  },
  mutations: {
    loading (state, bool) {
      state.isLoaded = bool
    }
  }
})
