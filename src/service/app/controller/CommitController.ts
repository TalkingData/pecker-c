import { Controller } from 'egg';
import { Commit } from '../model/Commit';


// 定义创建接口的请求参数规则
const createRule = {
    appkey: 'string',
    appVersion: { type:'string', required:false},
    records: 'array'
};

export default class CommitController extends Controller{
    async create(){
        await this.createCommit();
    }

    async index(){
        await this.createCommit();
    }

    async createCommit(){
        this.ctx.validate(createRule, this.ctx.service.commitService.getCommitData());
        let commitEntity:Commit = await this.ctx.service.commitService.saveCommit();
        this.ctx.service.recordService.processRecords(commitEntity);
        this.ctx.body = {
            id: commitEntity._id,
        };
        this.ctx.status = 200;
    }
}