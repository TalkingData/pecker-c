import { Service } from 'egg'
import { Commit } from '../model/Commit'
import CaughtErrorRecordHandler from './recordhandler/CaughtErrorRecordHandler'
import HttpErrorRecordHandler from './recordhandler/HttpErrorRecordHandler'
import ResourceErrorRecordHandler from './recordhandler/ResourceErrorRecordHandler'

export default class RecordService extends Service {
	constructor(ctx) {
		super(ctx)
	}

	async processRecords(commit: Commit) {
		commit.records.forEach(async (record: any) => {
			let errorRecord
			if (record.type == 'caughtError') {
				errorRecord = await new CaughtErrorRecordHandler(this.ctx).handle(record, commit)
			} else if (record.type == 'httpError') {
				errorRecord = await new HttpErrorRecordHandler(this.ctx).handle(record, commit)
			} else if (record.type == 'resourceError') {
				errorRecord = await new ResourceErrorRecordHandler(this.ctx).handle(record, commit)
			}
			if (errorRecord) {
				// this.ctx.service.mailService.triggerByErrorRecord(commit.appkey, errorRecord.toJSON());
			}
		})
		if (commit.appkey) {
			let nsp: any = this.ctx.app.io.of('/io')
			nsp.to(commit.appkey).emit('change', { appkey: commit.appkey })
		}
	}
}
