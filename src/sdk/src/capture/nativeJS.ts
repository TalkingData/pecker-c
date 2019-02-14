
import { handleErr } from './handleError'
import { httpMsg } from '../interfaces/index'
export function nativeJS(){
    //js错误
    window['error'] = function(msg:string):void{
        handleErr(msg,'caught');
    }
    //promise错误
    window.addEventListener('unhandledrejection',function(err:any){
        if(err.reason && err.reason.stack){
            handleErr(err.reason, 'caught');
        }
    },false);
    window.addEventListener('rejectionhandled',function(ev){
    },true);
    //静态资源加载错误
    window.addEventListener('error', function(event:Event) {
       handleErr(event.target,'resourceError')
    }, true);
    
    //http请求错误
    if (!window['XMLHttpRequest']) {
		return;
    }
    let requestUrl:string;
    let requestMethod:string;
	var xmlhttp = window['XMLHttpRequest'];
	
	var _oldSend = xmlhttp.prototype.send;
	var _oldOpen = xmlhttp.prototype.open;
	var _handleEvent = function (event:any,url:string,method:string) {
        if (event && event.currentTarget && event.currentTarget.status !== 200) {
            console.log(event)
            var data = {
                method: method,
                status: event.currentTarget.status,
                statusText: event.currentTarget.statusText,
                response: event.currentTarget.response.indexOf('!DOCTYPE html') != -1 ? "" : event.currentTarget.response,
                requestUrl: url
            };
            handleErr(data,'httpError');
        }
    }
    xmlhttp.prototype.open = function(){
       requestMethod = arguments[0];
       requestUrl = arguments[1];
       return _oldOpen.apply(this, arguments);
    }
	xmlhttp.prototype.send = function () {
        let _url:string = requestUrl;
        let _method:string = requestMethod;
		if (this['addEventListener']) {
            this['addEventListener']('error', function(event){
                _handleEvent(event,_url,_method)
            });
            this['addEventListener']("timeout", function(event){
                _handleEvent(event,_url,_method)
            })
			this['addEventListener']('load', function(event){
                _handleEvent(event,_url,_method)
            });
			this['addEventListener']('abort', function(event){
                _handleEvent(event,_url,_method)
            });
		} else {
			var _oldStateChange = this['onreadystatechange'];
			this['onreadystatechange'] = function (event:any) {
				if (this.readyState === 4) {
					_handleEvent(event,_url,_method);
				}
				_oldStateChange && _oldStateChange.apply(this, arguments);
			};
		}
		return _oldSend.apply(this, arguments);
	}
}
