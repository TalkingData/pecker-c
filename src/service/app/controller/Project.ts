'use strict';

import { Controller } from 'egg';
const utils = require('utility');
import ResponseBody from '../interface/response.body';

export default class ProjectController extends Controller {
  async index() {
    const { ctx, service } = this;
    const result = await service.project.index({
      user: ctx.user._id
    });
    // const result = await service.project.index(ctx.params);
    const res: ResponseBody = {
      status: 200,
      result
    };
    ctx.status = 200;
    ctx.body = res;
  }
  async projectOverview() {
    const { ctx, service } = this;
    const result = await service.project.projectOverview({
      user: ctx.user._id
    });
    const res: ResponseBody = {
      status: 200,
      result
    };
    ctx.status = 200;
    ctx.body = res;
  }

  async show() {
    const { ctx, service } = this;
    const result = await service.project.show({ _id: ctx.params.id });
    const res: ResponseBody = {
      status: 200,
      result
    };
    ctx.status = 200;
    ctx.body = res;
  }

  // 添加项目
  async create() {
    const { ctx, service } = this;
    const reqBody = ctx.request.body;
    const name = reqBody.name;

    ctx.validate(
      {
        name: { type: 'string' },
        language: { type: 'string' },
        framework: { type: 'string' }
      },
      reqBody
    );
    const appkey = utils.md5(name + new Date().getTime());
    const project = await service.project.create({
      ...reqBody,
      appkey
    });
    // 项目创建者为项目管理员
    await service.roleMap.create({
      user: ctx.user._id,
      project: project._id,
      role: 1
    });
    const res: ResponseBody = {
      status: 200,
      result: project
    };
    ctx.status = 200;
    ctx.body = res;
  }

  async update() {
    const { ctx, service } = this;
    await service.project.update(ctx.params.id, ctx.request.body);
    const res: ResponseBody = {
      status: 200
    };
    ctx.status = 200;
    ctx.body = res;
  }

  async destroy() {
    const { ctx, service } = this;
    const result = await service.project.projectErrorInfo(ctx.params);
    if (result.length) {
      if (result[0].count <= 0) {
        await service.project.destroy(ctx.params);
        const res: ResponseBody = {
          status: 200
        };
        ctx.status = 200;
        ctx.body = res;
      } else {
        const res: ResponseBody = {
          status: 403,
          errorMessage: '项目已包含错误信息，禁止删除！'
        };
        ctx.status = 403;
        ctx.body = res;
      }
    } else {
      const res: ResponseBody = {
        status: 500,
        errorMessage: '项目Id错误'
      };
      ctx.status = 403;
      ctx.body = res;
    }
  }
}
