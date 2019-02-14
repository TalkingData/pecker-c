import socket from 'socket.io-client';
import Utils from '@/lib/utils';
// import Vue from 'vue';

const socketClient = {
  state: {
    socketConnect: '',
  },
  mutations: {
    SET_SOCKET_CONNECTION(state) {
      state.socketConnect = socket(`${Utils.baseUrl()}/io`); // 建立连接
      state.socketConnect.on('connect', (data) => { // 接收消息
        console.log('connect!');
        console.log(data);
        // Vue.$store.commit('SET_ERROR_OVIER_CHART_DATA');
        // Vue.$store.commit('SET_ERROR_OVIER_DATA_LIST');
      });
    },
    SET_SOCKET_FILTER(state, data) {
      state.socketConnect.emit('filter', data);
    },
    // SET_SOCKET_ON_CHANGE(state) {
    //   state.socketConnect.on('change', () => {
    //     Vue.$store.commit('SET_ERROR_OVIER_CHART_DATA');
    //     Vue.$store.commit('SET_ERROR_OVIER_DATA_LIST');
    //   });
    // },
  },
};

export default socketClient;
