import { Service } from 'egg';
import { Types } from 'mongoose';

export default class ProjectService extends Service {
  async index(params) {
    const ObjectId = Types.ObjectId;

    const { ctx } = this;
    let aggregate: Array<any> = [];
    // 过滤roleMap，返回包含该项目的所有用户以及对应的权限
    // project使用string类型，ObejctId $match匹配不上

    // 根据用户过滤项目
    aggregate.push({
      $match: {
        user: ObjectId(params.user)
      }
    });
    // 关联项目表
    aggregate.push(
      {
        $lookup: {
          from: 'web_project',
          localField: 'project',
          foreignField: '_id',
          as: 'project_info'
        }
      },
      { $unwind: '$project_info' }
    );
    // $project 挑选字段
    aggregate.push({
      $project: {
        role: '$role',
        _id: '$project_info._id',
        name: '$project_info.name',
        language: '$project_info.language',
        framework: '$project_info.framework',
        appkey: '$project_info.appkey'
      }
    });
    const result = await ctx.model.RoleMap.aggregate(aggregate);
    return result;
  }
  async projectOverview(params) {
    const ObjectId = Types.ObjectId;
    const { ctx } = this;
    let aggregate: Array<any> = [];
    // 根据用户过滤项目
    aggregate.push({
      $match: {
        user: ObjectId(params.user)
      }
    });
    // 关联项目表
    aggregate.push(
      {
        $lookup: {
          from: 'web_project',
          localField: 'project',
          foreignField: '_id',
          as: 'project_info'
        }
      },
      { $unwind: '$project_info' }
    );
    // $project 挑选字段
    aggregate.push({
      $project: {
        _id: '$project_info._id',
        name: '$project_info.name',
        language: '$project_info.language',
        framework: '$project_info.framework',
        appkey: '$project_info.appkey'
      }
    });
    // 关联错误表
    aggregate.push(
      {
        // $lookup: {
        //   from: 'error_records',
        //   localField: 'appkey',
        //   foreignField: 'appkey',
        //   as: 'project_error_info'
        // }
        $lookup: {
          from: 'error_records',
          let: { projectAppkey: '$appkey' },
          pipeline: [{
            $match: { 
              $expr: { $and:
                 [
                   { $eq: [ "$appkey",  "$$projectAppkey" ] },
                 ]
              }
           }
          },{ $project: { _id: 1 } }],
          as: 'project_error_info'
        }
      },
      {
        $project: {
          name: 1,
          language: 1,
          framework: 1,
          appkey: 1,
          count: {
            $size: '$project_error_info'
          }
        }
      }
    );
    const result = await ctx.model.RoleMap.aggregate(aggregate);
    // const result = await ctx.model.RoleMap.aggregate(aggregate, ()=>({ allowDiskUse: true }));
    return result;
  }
  async projectErrorInfo(params) {
    const ObjectId = Types.ObjectId;
    const { ctx } = this;
    let aggregate: Array<any> = [];
    // 查询项目表appkey
    aggregate.push({
      $match: {
        _id: ObjectId(params.id)
      }
    });
    // 关联错误表
    aggregate.push(
      {
        $lookup: {
          from: 'error_records',
          localField: 'appkey',
          foreignField: 'appkey',
          as: 'project_error_info'
        }
      },
      {
        $project: {
          count: {
            $size: '$project_error_info'
          }
        }
      }
    );
    const result = await ctx.model.Project.aggregate(aggregate);
    return result;
  }

  async show(params) {
    const { ctx } = this;
    let result = await ctx.model.Project.find(params);
    return result[0];
  }

  async create(request) {
    const { ctx } = this;
    let result = await ctx.model.Project.create(request);
    return result;
  }

  async update(_id, request) {
    const { ctx } = this;
    const result = await ctx.model.Project.findOneAndUpdate(
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
    let result = await ctx.model.Project.remove({
      _id: { $in: params.id.split(',') }
    });
    return result;
  }
}
