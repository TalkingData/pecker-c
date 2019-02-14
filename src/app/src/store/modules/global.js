import {
  wsGetProjectDetail,
} from '@/models/project';

const global = {
  state: {
    appkey: '', // 所选项目appKey
    projectId: '', // 所选项目的projectId
    projectName: '', // 所选项目名称
  },
  mutations: {
    SET_PROJTCT_INFO(state, data) {
      state.appkey = data.appkey;
      // eslint-disable-next-line
      state.projectId = data._id;
      state.projectName = data.name;
    },
  },
  actions: {
    /**
     * 更新项目信息操作
     * @param {*} param0
     * @param {*} params
     */
    updateAppKey({ commit }, params) {
      return new Promise((resolve) => {
        wsGetProjectDetail({
          projectid: params,
        }).then((data) => {
          if (data.status === 200) {
            commit('SET_PROJTCT_INFO', data.result);
            resolve();
          }
        });
      });
    },
  },
};

export default global;
