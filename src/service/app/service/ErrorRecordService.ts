import { Service } from 'egg'

export default class ErrorRecordService extends Service {
	async getErrorRecords(errorId?: string) {
		let aggregate: Array<any> = []
		if (errorId) {
			aggregate.push({
				$match: {
					errorId: errorId
				}
			})
		}
		aggregate.push({
			$project: {
				_id: 1,
				occurTime: 1,
				osName: 1,
				browserName: 1,
				type: 1,
				name: 1,
				'location.city': 1,
				'location.country': 1,
				'location.regionName': 1,
				'location.fail': 1,
				errorId: 1
			}
		})

		aggregate.push({
			$sort: { occurTime: -1 }
		})

		return await this.ctx.model.ErrorRecord.aggregate(aggregate)
	}

	async getErrorRecordById(id: string) {
		return await this.ctx.model.ErrorRecord.findById(id)
	}

	async getErrorCountsByTime(appkey: string, start: number, end: number) {
		return this.ctx.model.ErrorRecord.find({
			appkey: appkey,
			occurTime: {
				'$gte': start,
				'$lte': end
			}
		}).count()
	}
}
