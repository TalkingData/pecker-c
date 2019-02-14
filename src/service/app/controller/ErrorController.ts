import { Controller } from 'egg';

const errorFilterValidtor = {
    appkey:{
        type:'string', required:true
    },
    type:{
        type:'string', required:false
    },
    pageSize:{
        type:'string',  required:false
    },
    pageNumber:{
        type:'string',  required:false
    },
    start:{
        type:'string',  required:false
    },
    end:{
        type:'string',  required:false
    },
};

export default class ErrorController extends Controller{
    async index(){
        this.ctx.validate(errorFilterValidtor, this.ctx.query);
        this.ctx.body = await this.ctx.service.errorService.getErrors(this.ctx.query);
    }

    async show(){
        let id = this.ctx.params.id;
        this.ctx.body = await this.ctx.service.errorService.getErrorById(id);
    }
}