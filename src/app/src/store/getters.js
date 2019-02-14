const getters = {
  appkey: state => state.global.appkey,
  projectId: state => state.global.projectId,
  chartObj: state => state.overviewerrors.chartObj,
  overErrorList: state => state.overviewerrors.overErrorList,
  errorListLoading: state => state.overviewerrors.errorListLoading,
  socketConnect: state => state.socket.socketConnect,
};
export default getters;
