'use strict';

import { Controller } from 'egg';
const validator = require('validator');
const utils = require('utility');
import ResponseBody from '../interface/response.body';

export default class UserController extends Controller {
  async index() {
    const { ctx } = this;
    let result;

    if (ctx.query.project) {
      result = await this.service.user.projectUser(ctx.query);
    } else if (ctx.query['project!']) {
      result = await this.service.user.projectUserAddable(ctx.query);
    } else {
      result = await this.service.user.index(ctx.query);
    }
    const res: ResponseBody = {
      status: 200,
      result
    };
    ctx.status = 200;
    ctx.body = res;
  }
  async show() {
    const { ctx } = this;
    const result = await this.service.user.show({ _id: ctx.params.id });
    const res: ResponseBody = {
      status: 200,
      result: result
    };
    ctx.status = 200;
    ctx.body = res;
  }

  // 添加用户
  async create() {
    const { ctx, service, app } = this;
    const name = validator.trim(ctx.request.body.name || '');
    const email = validator.trim(ctx.request.body.email || '').toLowerCase();
    const password = validator.trim(ctx.request.body.password || '');
    const rePassword = validator.trim(ctx.request.body.rePassword || '');

    let msg;
    // 验证信息的正确性
    if (
      [name, password, rePassword, email].some(item => {
        return item === '';
      })
    ) {
      msg = '信息不完整。';
    }
    // else if (name.length < 5) {
    //   msg = '用户名至少需要5个字符。';
    // }
    else if (!ctx.helper.validateId(name)) {
      msg = '用户名不合法。';
    } else if (!validator.isEmail(email)) {
      msg = '邮箱不合法。';
    } else if (password.length < 5) {
      msg = '密码至少需要5个字符。';
    } else if (password !== rePassword) {
      msg = '两次密码输入不一致。';
    }
    // END 验证信息的正确性
    if (msg) {
      const res: ResponseBody = {
        status: 201,
        errorMessage: msg
      };
      ctx.status = 200;
      ctx.body = res;
      return;
    }
    const users = await service.user.index({ $or: [{ name }, { email }] }, {});
    if (users.length > 0) {
      const res: ResponseBody = {
        status: 201,
        errorMessage: '用户名或邮箱已被使用。'
      };
      ctx.status = 200;
      ctx.body = res;
      return;
    }

    const pwdHash = utils.md5(password + app.config.site_salt);
    const user = await service.user.create({
      name,
      password: pwdHash,
      email
    });

    // const project = validator.trim(ctx.request.body.project || '');
    // 若是包含项目Id，rolemap表新增一条记录，默认角色为成员
    // if (project) {
    //   await service.roleMap.create({
    //     user: user._id,
    //     project,
    //     role: 2
    //   });
    // }
    const res: ResponseBody = {
      status: 200,
      result: user
    };
    ctx.status = 200;
    ctx.body = res;
  }

  // 退出
  async logout() {
    const { ctx } = this;
    ctx.session = null;
    ctx.logout();
    const res: ResponseBody = {
      status: 200,
      result: '登出成功'
    };
    ctx.status = 200;
    ctx.body = res;
  }

  async update() {
    const { ctx } = this;
    await this.service.user.update(this.ctx.params.id, this.ctx.request.body);
    const res: ResponseBody = {
      status: 200
    };
    ctx.status = 200;
    ctx.body = res;
  }

  async destroy() {
    const { ctx, service } = this;
    await service.user.destroy(ctx.params);
    const res: ResponseBody = {
      status: 200
    };
    ctx.status = 200;
    ctx.body = res;
  }
}
