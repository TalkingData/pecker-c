import { Service } from 'egg';
import { Types } from 'mongoose';

export default class UserService extends Service {
  async index(params, opt = {}) {
    let user = await this.ctx.model.User.find(params, '', opt).exec();
    return user;
  }
  async projectUser(params) {
    const ObjectId = Types.ObjectId;
    let aggregate: Array<any> = [];
    // 过滤roleMap，返回包含该项目的所有用户以及对应的权限
    // project使用string类型，ObejctId $match匹配不上
    if (params.project) {
      aggregate.push({
        $match: {
          project: ObjectId(params.project)
        }
      });
    }
    // 关联用户表
    // user字段和_id字段都使用ObejctId类型可以匹配上
    aggregate.push(
      {
        $lookup: {
          from: 'web_user',
          localField: 'user',
          foreignField: '_id',
          as: 'user_info'
        }
      },
      { $unwind: '$user_info' }
    );
    // $project 挑选字段
    aggregate.push({
      $project: {
        role: 1,
        name: '$user_info.name',
        email: '$user_info.email'
      }
    });
    const result = await this.ctx.model.RoleMap.aggregate(aggregate);
    return result;
  }

  async projectUserAddable(params) {
    let aggregate: Array<any> = [];
    const ObjectId = Types.ObjectId;
    if (params['project!']) {
      aggregate.push({
        $match: {
          project: ObjectId(params['project!'])
        }
        // $match: {
        //   project: { $ne: ObjectId(params.project) }
        // }
      });
      // 关联用户表
      // user字段和_id字段都使用ObejctId类型可以匹配上
      aggregate.push(
        {
          $lookup: {
            from: 'web_user',
            localField: 'user',
            foreignField: '_id',
            as: 'user_info'
          }
        },
        { $unwind: '$user_info' }
      );
      // $project 挑选字段
      aggregate.push({
        $project: {
          user: 1
        }
      });
      const user = await this.ctx.model.RoleMap.aggregate(aggregate);
      const tempUsers = user.map((item)=>{
        return String(item.user)
      });
      const users = Array.from(new Set(tempUsers));
      const result = await this.ctx.model.User.find({
        _id: {$nin:[...users]}
      });
      return result;
    }
  }
  async show(params) {
    const { ctx } = this;
    let result = await ctx.model.User.find(params);
    return result[0];
  }
  async create(request) {
    const ctx = this.ctx;
    let result = await ctx.model.User.create(request);
    return result;
  }
  async update(_id, request) {
    const ctx = this.ctx;
    let result = await ctx.model.User.findOneAndUpdate(
      { _id },
      { $set: request }
    );
    return result;
  }

  async destroy(params) {
    if (!params && !params.id) {
      return;
    }
    let result = await this.ctx.model.User.remove({
      _id: { $in: params.id.split(',') }
    });
    return result.result;
  }

  async logout() {
    const { ctx } = this;
    ctx.session = null;
    ctx.logout();
    ctx.redirect('/');
  }
}
