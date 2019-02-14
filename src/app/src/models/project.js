import schema from './';
// 新建项目
export const wsPostProject = schema.post('/api/project', {
  name: { type: String, required: true },
  language: { type: String, required: true },
  framework: { type: String, required: true },
});

// 项目列表
export const wsGettProject = schema.get('/api/project', {});

// 获取项目列表
export const wsGetProjectOview = schema.get('/api/project/view/overview', {});

// 查询具体用户项目列表基本信息
export const wsGetProject = schema.get('/project', {});

// 查询单个项目详情信息
export const wsGetProjectDetail = schema.get('/api/project/{projectid}', {
  projectid: { type: String, required: true, urlOnly: true },
});

// 修改单个项目详情信息
export const wsPutProjectDetail = schema.put('/api/project/{projectid}', {
  projectid: { type: String, required: true, urlOnly: true },
  name: { type: String, required: true },
});

// 删除单个项目信息
export const wsDeleteProject = schema.delete('/api/project/{projectid}', {
  projectid: { type: String, required: true, urlOnly: true },
});

// 获取错误概览图表数据
export const wsGetProjectChartData = schema.get('/api/errorrecords/aggregate/time', {
  appkey: { type: String, required: false },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
});

// 新增阈值
export const wsPostProjectWornSetting = schema.post('api/warning/rules', {
  appkey: { type: String, required: true },
  errorsCount: { type: Number, required: true },
});

// 获取阈值
export const wsGetProjectWornSetting = schema.get('api/warning/rules', {
  appkey: { type: String, required: true },
});

// 修改阈值
export const wsUpdateProjectWornSetting = schema.put('api/warning/rules/{ruleId}', {
  ruleId: { type: String, required: true },
  appkey: { type: String, required: true },
  errorsCount: { type: Number, required: true },
});

