const Subscription = require('egg').Subscription
const utils = require('utility')

class SendMailByRules extends Subscription {
	static rules = {
		interval: 1800000, // 默认半小时间隔
		errorsCount: 2, // 错误条数规则
		type: 'all' // 指定所有的 worker 都需要执行
	}
	/**
	 * 通过 schedule 属性来设置定时任务的执行间隔等配置
	 */
	static get schedule() {
		// for test
		// SendMailByRules.rules.interval = 6 * 60 * 1000
		return SendMailByRules.rules
	}

	// const res = await this.ctx.curl("http://www.baidu.com", {
	//   dataType: "json"
	// });
	/**
	 * task for schedule 定时任务
	 */
	async subscribe() {
		const endTime = Date.now(),
			startTime = endTime - SendMailByRules.rules.interval
		// console.log('sde:', startTime, '-', utils.YYYYMMDDHHmmss(endTime))
		let rules = await this.service.warningRulesService.queryRules()
		// console.log('res:', rules)
		if (!rules || !rules.length) return
		// 处理项目调度
		for (let i = 0; i < rules.length; i++) {
			const _rule = rules[i]
			let counts = await this.service.errorRecordService.getErrorCountsByTime(_rule.appkey, startTime, endTime)
			if (counts >= _rule.errorsCount) {
				let prj = await this.service.project.show({ appkey: _rule.appkey })
				this.service.mailService.sentWarningMail({
					name: prj.name,
					appkey: _rule.appkey,
					id: prj.id,
					time: utils.YYYYMMDDHHmmss(endTime),
					total: counts
				})
			}
		}
		// for test
		// let prj = await this.service.project.show({ appkey: 'ba3359db0099679a929bdef0fe43b8d5' })
		// this.service.mailService.sentWarningMail({
		// 	name: prj.name,
		// 	appkey: 'ba3359db0099679a929bdef0fe43b8d5',
		// 	time: utils.YYYYMMDDHHmmss(endTime),
		// 	total: 100
		// })
		// end
	}
}

module.exports = SendMailByRules
