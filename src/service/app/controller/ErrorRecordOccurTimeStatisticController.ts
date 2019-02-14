import { Controller } from 'egg';

export default class ErrorRecordOccurTimeStatisticController extends Controller {
    async index() {
        let query = this.ctx.query;
        this.ctx.validate({
            appkey: { type: 'string', required: true },
            start: { type: 'string', format:/^-?[1-9]+[0-9]*$/, required: false },
            end: { type: 'string', format:/^-?[1-9]+[0-9]*$/, required: false },
            groupby: { type: 'string', format:/hour|day|month|week/, required: false }
        }, query);
        
        this.ctx.body = await this.ctx.service.errorRecordStatisticService.statisticByOccurTime(query.appkey, Number(query.start), Number(query.end), query.groupby);
    }
}