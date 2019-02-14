
import { Handler } from './Handler';
import { Record } from '../../model/Record';
import { Commit } from '../../model/Commit';
import BasicParser from '../parser/BasicParser';
import LocationParser from '../parser/LocationParser';
import UserAgentParser from '../parser/UserAgentParser';
import { Context } from 'egg';


export abstract class ErrorRecordHandler implements Handler {
    constructor(private ctx) { }

    async handle(record:Record, commit:Commit) {
        let error = await this._parseToErrorRecord(record, commit);
        let errorRecord = new this.ctx.model.ErrorRecord(error);
        await errorRecord.save();
        return errorRecord;
    }

    async _parseToErrorRecord(record, commitEntity) {
        let result: any = {};
        let data = record.data;
        //some basic info
        result = Object.assign(result, await new BasicParser(record, commitEntity).parse());

        //parse location info
        result = Object.assign(result, await new LocationParser(this.ctx, commitEntity).parse());

        //parse userAgent
        result = Object.assign(result, await new UserAgentParser(data.userAgent).parse());

        result = Object.assign(result, await this.parse(data, commitEntity, this.ctx));

        result.errorId = this.getErrorId(data, result);
        result.name = this.getErrorName(data, result);
        return result;
    }
    abstract parse(data, commit:any, ctx:Context):any;
    abstract getErrorId(data:any, _parsedResult?:any):string;
    abstract getErrorName(data:any, _parsedResult?:any):string;
}