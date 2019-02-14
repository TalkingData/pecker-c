import { parmas } from '../interfaces/index'
import { queryString } from '../util/index'
import  Config from '../config/index'
export function handleErr(error:any,type:string):void{
    let msg:parmas = {
        appkey:Config.appkey,
        disable:Config.disable,
        appVersion:'1.0',
        records:[]
    }
    if(!!msg.disable) {
        switch (type) {
            case 'resourceError':
                reportResourceError(msg,error)
              break;
            case 'httpError':
                reportHttpError(msg,error)
              break;
            case 'caught':
                reportCaughtError(msg,error)
              break;
            case 'promise':
                reportPromiseError(msg,error)
              break;
      
        }
    }
}


function reportResourceError(msg:parmas,data:any):void{
    msg.records = [
        {
            type:'resourceError',
            data:{
                outerHTML:data.outerHTML,
                src:data.src,
                tagName:data.localName.toUpperCase(),
                occurTime:new Date().getTime(),
                title:document.title,
                url:window.location.href,
                userAgent:window.navigator.userAgent
            }
        }
    ];
    // console.log('resourceError :' + queryString(msg))
    new Image().src = `${Config.uploadUrl}?commit=${queryString(msg)}`
}
function reportHttpError(msg:parmas,data:any):void{
    msg.records = [
        {
            type:'httpError',
            data:{
                occurTime:new Date().getTime(),
                title:document.title,
                url:window.location.href,
                userAgent:window.navigator.userAgent,
                method:data.method ? data.method : 'GET',
                status:data.status,
                statusText:data.statusText,
                response:data.response,
                requestUrl:data.url || data.requestUrl
            }
        }
    ]
    console.log(msg)
    // console.log('httpError :' + queryString(msg))
    new Image().src = `${Config.uploadUrl}?commit=${queryString(msg)}`
}
function reportCaughtError(msg:parmas,data:any):void{
    msg.records = [
        {
            type:'caughtError',
            data:{
                occurTime:new Date().getTime(),
                title:document.title,
                url:window.location.href,
                userAgent:window.navigator.userAgent,
                stacktrace:data.stack,
            }
        }
    ] 
    console.log(msg)
    // console.log('caughtError :' + queryString(msg));
    new Image().src = `${Config.uploadUrl}?commit=${queryString(msg)}`
}
function reportPromiseError(msg:parmas,data:any):void{
    msg.records = [
        {
            type:'caughtError',
            data:{
                occurTime:new Date().getTime(),
                title:document.title,
                url:window.location.href,
                userAgent:window.navigator.userAgent,
                name:"unhandledrejection",
            }
        }
    ]  
    console.log(msg)
    // console.log('promiseError :' + queryString(msg));
    new Image().src = `${Config.uploadUrl}?commit=${queryString(msg)}`
}