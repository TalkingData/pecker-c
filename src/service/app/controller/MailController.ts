import { Controller } from 'egg';

export default class MailController extends Controller{
    async create(){
        this.ctx.validate({subject:'string', content:'string', to:{type:'string', required: true, allowEmpty: false, format:/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/g} }, this.ctx.request.body);
        let {subject, content, to} = this.ctx.request.body;
        await this.ctx.service.mailService.sent(to, subject, content);
        this.ctx.body = {};
    }
}