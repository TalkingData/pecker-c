'use strict';
import ResponseBody from '../interface/response.body';
// 不需要控制的接口
// -------
// 用户注册
// 修改用户信息（没有界面）
// 用户查询（自动根据当前查询对应的用户）
// -------
// 创建项目
// 查看项目（自动根据当前用户查询对应的项目）
// 获取用户项目角色
// --------------------------------------
// 真正需要控制的只有几个地方
// -------
// 删除项目
// 修改项目
// -------
// 删除用户（没有界面）
// -------
// 项目添加成员
// 项目删除成员
// 修改项目成员权限
const allPrivilege = [
  'DELETE_destroy_project',
  'PUT_project',
  'POST_rolemaps',
  // 'PUT_rolemap',
  'DELETE_destroy_rolemap'
];

const privilegeList = [
  // 超级管理员
  [...allPrivilege],
  // 管理员
  [...allPrivilege],
  // 成员
  []
];

const getProject = async ctx => {
  let project = '';
  // 通用规则
  switch (ctx.request.method) {
    case 'DELETE':
    case 'PUT':
      project = ctx.params.id;
      break;
    case 'POST':
      project = ctx.request.body.project;
      break;
    default:
      break;
  }
  // 特殊规则
  switch (ctx._matchedRouteName) {
    case 'destroy_rolemap': // 删除rolemap
      const roleMap = await ctx.service.roleMap.index({ _id: ctx.params.id });
      project = roleMap[0] && roleMap[0].project;
      break;
    case 'rolemap': // 修改rolemap
      project = ctx.request.body.project;
      break;
    default:
      break;
  }
  return project;
};

const getRole = async (ctx, project) => {
  if (project) {
    const user = ctx.user._id;
    const roleMap = await ctx.service.roleMap.index({
      user,
      project
    });
    if (roleMap[0]) return roleMap[0].role;
  }
  return 2;
};

export default () => {
  /*
   * 需要登录
   */
  return async function(ctx, next) {
    const methodStr = ctx.request.method;
    const routerNameStr = ctx._matchedRouteName;
    const curPrivilege = methodStr + '_' + routerNameStr;
    // console.log('=================================');
    // console.log(ctx.request.method);
    // console.log(ctx.request.path);
    // console.log(ctx._matchedRoute);
    // console.log(ctx._matchedRouteName);
    // console.log(curPrivilege);
    // console.log('=================================');
    // 只对需要控制的路由添加权限
    if (allPrivilege.includes(curPrivilege)) {
      // 查询用户对应项目的角色
      const project: any = await getProject(ctx);
      const role = await getRole(ctx, project);
      // console.log(project);
      // console.log(role);
      const curPrivilegeList = privilegeList[role];
      const permission = curPrivilegeList.includes(curPrivilege);
      if (!permission) {
        const res: ResponseBody = {
          status: 403,
          errorMessage: '您没有权限操作，请联系管理员！'
        };
        ctx.status = 403;
        ctx.body = res;
        return;
      }
    }
    await next();
  };
};
