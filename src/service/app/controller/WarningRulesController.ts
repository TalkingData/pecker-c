import { Controller } from 'egg'
import ResponseBody from '../interface/response.body'

const warningRulesValidtor = {
	appkey: {
		type: 'string',
		required: true
	},
	interval: {
		type: 'number',
		required: false
	},
	errorsCount: {
		type: 'number',
		required: true
	}
}

export default class WarningRulesController extends Controller {
	/**
	 * 查询规则
	 */
	async index() {
		const { ctx, service } = this
		ctx.validate({ appkey: { type: 'string', required: true } }, ctx.query)
		let result = await service.warningRulesService.queryRulesByAppkey(ctx.query.appkey)
		const res: ResponseBody = {
			status: 200,
			result
		}
		ctx.body = res
	}
	/**
	 * 生效规则
	 */
	async create() {
		const { ctx, service } = this
		let result
		ctx.validate(warningRulesValidtor, ctx.request.body)
		const res: ResponseBody = {
			status: 200
		}
		result = await service.warningRulesService.queryRulesByAppkey(ctx.request.body.appkey)
		if (result && result.length) {
			res.status = 422
			res.errorMessage = 'exist rules!'
			return (ctx.body = res)
		}
		result = await service.warningRulesService.insertRules(ctx.request.body)
		res.result = result
		ctx.body = res
	}

	/**
	 * 更新规则
	 */
	async update() {
		const { ctx, service } = this
		ctx.validate(warningRulesValidtor, ctx.request.body)
		let result = await service.warningRulesService.updateRulesById(ctx.params.id, ctx.request.body)
		const res: ResponseBody = {
			status: 200,
			result
		}
		ctx.body = res
	}
}
