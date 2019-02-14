import schema from './';
// 获取错误信息
export const wsGetErrorsList = schema.get('/api/errors', {
  appkey: { type: String, required: false },
  type: { type: String, required: false },
  pageSize: { type: Number, required: false },
  pageNumber: { type: Number, required: false },
  start: { type: Number, required: false },
  end: { type: Number, required: false },
});

// 获取错误详情
export const wsGetErrorsDetail = schema.get('/api/errors/{errorid}', {
  errorid: { type: String, required: true, urlOnly: true },
});

// 获取错误记录
export const wsGetErrorRecordsList = schema.get('/api/errorrecords', {
  errorid: { type: String, required: true },
});

// 获取错误记录详情
export const wsGetErrorRecordsDetail = schema.get('/api/errorrecords/{errorrecordid}', {
  errorrecordid: { type: String, required: true, urlOnly: true },
});
