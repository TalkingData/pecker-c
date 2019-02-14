import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import global from './modules/global';
import overviewerrors from './modules/overviewerrors';
import socket from './modules/sockets';
import VueBus from 'vue-bus';

Vue.use(Vuex);
Vue.use(VueBus);
const store = new Vuex.Store({
  state: {
    role: 0, // 所选项目角色
  },
  modules: {
    global,
    overviewerrors, // 错误概览页面数据
    socket,
  },
  getters,
});

export default store;
