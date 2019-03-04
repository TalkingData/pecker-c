import nativeJS from "./nativeJS";
import handleErr from './handleError';
import { ConfigParams } from '../interfaces'
import Config  from '../config'
export  class YZMonitor{
    static config:ConfigParams = {
        appkey:"",
        disable:1, // 是否上报： 默认为 1 上报， 0 不上报
        uploadUrl:"" // 错误上报地址
    };
    timer:any
    constructor(){
       this.getAppkey();
       nativeJS()
    }
    static notify(error:any){
        // console.log(error.name)
        let errName:string = error.name;
        if(!errName)return;
        let errMsg:string = error.message;
        let type:string = 'caught';
        if(errMsg){
            let errMsgArr = errMsg.split(/[\n,]/g);
            let firstLine:string;
            type = errName.indexOf("http") != -1 ? 'httpError' : 'caught';
        }
        handleErr(error,type);
    }
    getAppkey(){
      this.timer =  setInterval(() =>{
        if(YZMonitor.config.appkey){
            Config.appkey = YZMonitor.config.appkey;
            Config.disable = YZMonitor.config.disable;
            Config.uploadUrl = YZMonitor.config.uploadUrl;
            clearInterval(this.timer);
        }
      },100) 
      
    }
}
new YZMonitor();