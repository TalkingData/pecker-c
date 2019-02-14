import {
  getProject,
  getOverviewErrorList,
  getOverviewChartData,
} from './mutation_type.js';

export default {
  [getProject](state, val) {
    state.project = val;
  },
};