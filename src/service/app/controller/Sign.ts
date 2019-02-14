'use strict';

import { Controller } from 'egg';
import ResponseBody from '../interface/response.body';

export default class signController extends Controller {
  async index() {
    const { ctx } = this;
    let result;
    if (ctx.query.project) {
      result = await this.service.user.projectUser(ctx.query);
    } else {
      result = await this.service.user.index(this.ctx.query);
    }
    const res: ResponseBody = {
      status: 200,
      result
    };
    ctx.status = 200;
    ctx.body = res;
  }
  async success() {
    const { ctx } = this;
    const res: ResponseBody = {
      status: 200,
      result: 'SUCCESS'
    };
    ctx.status = 200;
    ctx.body = res;
  }
  async fail() {
    const { ctx } = this;
    const res: ResponseBody = {
      status: 200,
      result: 'FAILURE',
      errorMessage: '用户名或密码错误'
    };
    ctx.status = 200;
    ctx.body = res;
  }
}
