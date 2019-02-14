import { wsGetProjectChartData } from '@/models/project';
import { wsGetErrorsList } from '@/models/error';

const overviewData = {
  state: {
    chartObj: [],
    overErrorList: {
      metadata: {
        total: 0,
        pageNumber: 0,
      },
    },
    errorListLoading: true,
  },
  mutations: {
    /**
     * 获取错误概览chart数据
     * @param {*} state
     * @param {*} data
     */
    SET_ERROR_OVIER_CHART_DATA(state, data) {
      state.chartObj = {
        columns: ['date', 'count'],
        rows: data,
      };
    },
    /**
     * 获取错误概览列表数据
     * @param {*} state
     * @param {*} data
     */
    SET_ERROR_OVIER_DATA_LIST(state, data) {
      const newData = {};
      Object.assign(newData, data);
      if (data.data.length === 0) {
        newData.metadata = {
          total: 0,
          pageNumber: 0,
        };
      }
      state.overErrorList = newData;
    },
    SET_ERROR_OVIER_LIST_LOADING(state, data) {
      state.errorListLoading = data;
    },
  },
  actions: {
    /**
     * 更新错误列表图表数据
     * @param {*} param0
     * @param {*} data
     */
    updateErrorOvierChartList({ commit }, params) {
      wsGetProjectChartData({
        // groupby: params.groupby,
        appkey: params.appkey,
        start: params.start,
        end: params.end,
      }).then((data) => {
        const date = [];
        if (data.length > 0) {
          if (data[0].groupby === 'hour') {
            data.forEach((item) => {
              date.push({
                date: `${item.year}-${item.month}-${item.day} ${item.hour}时`,
                count: item.count,
              });
            });
          } else {
            data.forEach((item) => {
              date.push({
                date: `${item.year}-${item.month}-${item.day}`,
                count: item.count,
              });
            });
          }
        } else {
          date.push({
            date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
            count: 0,
          });
        }
        commit('SET_ERROR_OVIER_CHART_DATA', date);
      });
    },
    /**
     * 更新错误概览列表
     * @param {*} param0
     * @param {*} data
     */
    updateErrorOvierDataList({ commit }, params) {
      commit('SET_ERROR_OVIER_LIST_LOADING', true);
      wsGetErrorsList({
        appkey: params.appkey,
        type: params.type,
        pageSize: params.pageSize,
        pageNumber: params.pageNumber,
        start: params.start,
        end: params.end,
      }).then((data) => {
        commit('SET_ERROR_OVIER_LIST_LOADING', false);
        commit('SET_ERROR_OVIER_DATA_LIST', data);
      });
    },
  },
};

export default overviewData;
