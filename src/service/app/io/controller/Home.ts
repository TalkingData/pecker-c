import { Controller } from 'egg';

export default class HomeController extends Controller{
    /**
     * 根据appkey(对应socket.io中的一个home)决定当前客户端选择的是哪个项目，
     * 如果该项目有新的错误记录，将只向该客户端发送更新通知
     */
    async filter(){
        let filterObj = this.ctx.args[0];
        if(filterObj.appkey){
            Object.keys(this.ctx.socket.rooms).forEach(async (room:string)=>{
                if(filterObj.appkey!==room&&this.ctx.socket.id!==room){
                    await this.ctx.socket.leave(room);
                }
            });
            if(!this.ctx.socket.rooms[filterObj.appkey]){
                await this.ctx.socket.join(filterObj.appkey);
            }
            this.ctx.socket.emit("change appkey filter:", this.ctx.socket.rooms);
        }
    }
}