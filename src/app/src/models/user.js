import schema from './';
// 登录
export const wsPostLogin = schema.post('/api/login', {
  name: { type: String, required: true },
  password: { type: String, required: true },
});

// 退出登录
export const wsGetLogout = schema.post('/api/logout', {});

// 创建用户
export const wsPostUser = schema.post('/api/user', {
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  rePassword: { type: String, required: true },
});

// 获取用户
export const wsGetUser = schema.get('/api/user', {
  project: { type: String, required: false },
});
// 获取可添加用户
export const wsGetAddUser = schema.get('/api/user?project!={project}', {
  project: { type: String, required: true, urlOnly: true },
});

// 创建用户
export const wsPostApiRolemap = schema.post('/api/rolemap', {
  user: { type: String, required: true },
  project: { type: String, required: true },
});

// 删除用户
export const wsDeleteApiRolemap = schema.delete('/api/rolemap/{roleMapId}', {
  roleMapId: { type: String, required: true, urlOnly: true },
});
