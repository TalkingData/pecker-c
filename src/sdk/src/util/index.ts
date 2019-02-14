export function queryString(obj:object):string{
    return encodeURIComponent(JSON.stringify(obj));
}


function isObject(obj:any):boolean{
    if(Object.prototype.toString.call(obj) == "[object Object]" || Object.prototype.toString.call(obj) == "[object Array]"){
        return true
    }
    return false;
}
