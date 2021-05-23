import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    saveCurrentSize(state, newSize) {
      // console.log(userInfo)
      // 存储到state
      state.newSize = newSize;
    },
  },
  getters: {},
  actions: {
    saveCurrentSize(context, newSize) {
      // mutation提交
      context.commit("saveCurrentSize", newSize);
    },
  },
  modules: {},
});
