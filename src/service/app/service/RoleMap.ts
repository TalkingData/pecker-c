import { Service } from 'egg';

export default class RoleMap extends Service {
  async index(params, opt = {}) {
    const { ctx } = this;
    let result = await ctx.model.RoleMap.find(params, '', opt).exec();
    return result;
  }

  async create(request) {
    const { ctx } = this;
    let result = await ctx.model.RoleMap.create(request);
    return result;
  }

  async update(_id, request) {
    const { ctx } = this;
    const result = await ctx.model.RoleMap.findOneAndUpdate(
      { _id },
      { $set: request }
    );
    return result;
  }

  async destroy(params) {
    if (!params && !params.id) {
      return;
    }
    const { ctx } = this;
    let result = await ctx.model.RoleMap.remove({
      _id: { $in: params.id.split(',') }
    });
    return result.result;
  }
}
