import schema from './';
// 获取上传列表
export const wsGetSourcemapList = schema.get('/api/operate/map?appkey={appkey}', {
  appkey: { type: String, required: true, urlOnly: true },
});

// 删除单个项目详情信息
export const wsDeleteSourceMap = schema.delete('/api/operate/map/{id}', {
  id: { type: String, required: false, urlOnly: true },
});
