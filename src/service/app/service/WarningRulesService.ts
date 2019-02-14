import { Service } from 'egg'

export default class WarningRulesService extends Service {
	/**
	 * 新增规则
	 * @param data
	 */
	async insertRules(data: any) {
		let _rule = new this.ctx.model.WarningRules(data)
		return _rule.save()
	}

	/**
	 * 根据id更新记录
	 * @param id
	 * @param data
	 */
	async updateRulesById(id: string, data: any) {
		return this.ctx.model.WarningRules.updateOne({ _id: id }, { $set: data }).exec()
	}

	/**
	 * 查询所有记录
	 */
	async queryRules() {
		return this.ctx.model.WarningRules.find({}).exec()
	}

	/**
	 * 根据appkey查询规则
	 * @param appkey
	 */
	async queryRulesByAppkey(appkey: string) {
		return this.ctx.model.WarningRules.find({ appkey }).exec()
	}
}
