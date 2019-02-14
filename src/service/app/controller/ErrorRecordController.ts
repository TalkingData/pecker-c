import { Controller } from 'egg';

export default class ErrorRecordController extends Controller {
    async index() {
        let errorId = this.ctx.query.errorid;
        this.ctx.validate({ errorid: 'string' }, this.ctx.query);
        this.ctx.body = await this.ctx.service.errorRecordService.getErrorRecords(errorId);
    }

    async show() {
        let id = this.ctx.params.id;
        this.ctx.body = await this.ctx.service.errorRecordService.getErrorRecordById(id);
    }
}