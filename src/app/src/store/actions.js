import {
  wsGetProjectChartData,
  wsGetProjectOview,
} from '@/models/project';

export default {
  /**
   * 获取错误概览图表数据
   * @param {*} param0 
   * @param {*} params 
   */
  getOverViewErrorChart({ dispatch, commit, state }, params) {
    wsGetProjectChartData({
      groupby: params.groupby,
      start: params.start,
      end: params.end,
    }).then((data) => {
      commit('getProjects', data.result);
    });
  },
  /**
   * 获取错误概览列表数据
   * @param {*} param0 
   * @param {*} params 
   */
  getOverViewErrorList({ dispatch, commit, state }, params) {
    wsGetProjectOview({}).then((data) => {
      commit('getProjects', data.result);
    });
  },
};