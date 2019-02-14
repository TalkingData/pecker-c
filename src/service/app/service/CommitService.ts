import { Service } from 'egg';
import { Commit } from '../model/Commit';

export default class CommitService extends Service{
    commit:any;

    constructor(ctx){
        super(ctx);
    }

    async saveCommit():Promise<Commit>{
        let commitData = this.getCommitData();
        let clientIp = this.ctx.request.ip;
        let appkey = commitData.appkey;
        let sessionId = this.ctx.session[appkey]||(this.ctx.session[appkey] = ""+Math.random());
        let commit = new this.ctx.model.Commit({
            timestamp: Date.now(),
            appkey:appkey,
            clientIp:clientIp,
            sessionId:sessionId
        });
        if(Array.isArray(commitData.records)){
            commitData.records.forEach(async r=>{
                await this._saveRecord(commit, r);
            })
            await commit.save();
        }else{
            await this._saveRecord(commit, commitData.records);
        }
        //ts 强转为Commit
        return <Commit> await this.ctx.model.Commit.populate(commit, {path: 'records'});
    }
    
   private async _saveRecord(commit, recordData){
        let record = new this.ctx.model.Record(recordData);
        record.commit = commit._id;
        commit.records.push(record._id);
        await record.save();
    }
    
    getCommitData(){ 
        if(this.ctx.request.method=="GET"){
            try{
                let commitQuery = this.ctx.request.queries["commit"];
                if(commitQuery&&commitQuery[0]){
                    return JSON.parse(commitQuery[0]);
                }
            }catch(e){
                return {};
            }
            
        }
        if(this.ctx.request.method=="POST"){
            return this.ctx.request.body;
        }
    }
}