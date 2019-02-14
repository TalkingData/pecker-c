'use strict';

import { Controller } from 'egg';
import ResponseBody from '../interface/response.body';

export default class RoleMapController extends Controller {
  async index() {
    const { ctx, service } = this;
    const result = await service.roleMap.index(ctx.params);
    ctx.body = { result };
    ctx.status = 200;
  }

  async create() {
    const { ctx, service } = this;
    const reqBody = ctx.request.body;

    ctx.validate(
      {
        user: { type: 'string' },
        project: { type: 'string' }
      },
      reqBody
    );
    const existRoleMap = await service.roleMap.index({ user: reqBody.user, project: reqBody.project });
    if(existRoleMap.length > 0) {
      const res: ResponseBody = {
        status: 403,
        errorMessage: '项目已包含该成员'
      };
      ctx.status = 403;
      ctx.body = res;
      return;
    }
    
    // 管理员添加权限只能是成员
    reqBody.role = 2;
    const result = await service.roleMap.create(reqBody);
    const res: ResponseBody = {
      status: 200,
      result
    };
    ctx.status = 200;
    ctx.body = res;
  }

  async update() {
    const { ctx, service } = this;
    const result = await service.roleMap.update(
      ctx.params.id,
      ctx.request.body
    );
    ctx.body = result;
    ctx.status = 200;
  }

  async destroy() {
    const { ctx, service } = this;
    await service.roleMap.destroy(ctx.params);
    const res: ResponseBody = {
      status: 200
    };
    ctx.status = 200;
    ctx.body = res;
  }
}
