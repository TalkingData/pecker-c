import { Service } from 'egg';

export default class SourceMapService extends Service {
  /**
   * 新增
   * @param data 
   */
  async insertMap(data: any) {
    let _map = new this.ctx.model.SourceMapList(data)
    return _map.save()
  }

  /**
   * 根据id更新记录
   * @param id 
   * @param data 
   */
  async updateMapById(id: string, data: any) {
    return this.ctx.model.SourceMapList.updateOne({ _id: id }, { $set: data })
      .exec()
  }

  /**
   * 查询上传记录
   */
  async queryMap(appkey: string, version?: string) {
    return this.ctx.model.SourceMapList.find({ appkey: appkey, version: version }).exec()
  }

  /**
   * 查询单条记录
   * @param id 
   */
  async queryMapById(id: string) {
    return this.ctx.model.SourceMapList.findOne({ _id: id }).exec()
  }

  /**
   * 删除多条记录
   * @param ids 
   */
  async deleteMapByIds(ids: Array<string>) {
    return this.ctx.model.SourceMapList.deleteMany({ '_id': { $in: ids } })
  }
}