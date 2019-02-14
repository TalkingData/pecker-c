'use strict';

import { Service } from 'egg';
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
const allPrivilege = ['deleteProject', 'updateProject', 'addRolemap', 'updateRolempap', 'deleteRolemap'];

const privilegeList = [
  // 超级管理员
  [...allPrivilege],
  // 管理员
  [
    'deleteProject',
    'updateProject',
    'addRolemap',
    'deleteRolemap',
    'updateRolempap',
  ],
  // 成员
  []
];

export default class UserService extends Service {
  async getRole(user, project) {
    const { service } = this;
    // console.log(ctx, user, project);
    const roleMap = await service.roleMap.index({
      user,
      project
    });
    // console.log(roleMap);
    
    if (roleMap[0]) return roleMap[0].role;
    return 2;
  }
  async matchPrivilege(user, project, curPrivilege) {
    const { ctx } = this;
    const role: any = await this.getRole(user, project);
    const curPrivilegeList = privilegeList[role];
    const permission = curPrivilegeList.includes(curPrivilege);
    if(!permission){
      const res: ResponseBody = {
        status: 403,
        errorMessage: '您没有权限操作，请联系管理员！'
      };
      ctx.status = 403;
      ctx.body = res;
      // return ;
    }
    return permission;
  }
}
