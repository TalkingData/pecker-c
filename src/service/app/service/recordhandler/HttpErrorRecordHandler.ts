import * as md5 from "md5";
import { ErrorRecordHandler } from './ErrorRecordHandler';

export default class HttpErrorRecordHandler extends ErrorRecordHandler {

    parse(data: any) {
        return {
            method: data.method,
            status: data.status,
            statusText: data.statusText,
            response: data.response,
            requestUrl:data.requestUrl
        }
    }

    getErrorId(data: any, _parsedResult?: any): string {
        return md5(data.method + data.requestUrl + data.status + data.statusText + data.response);
    }

    getErrorName(data: any, _result:any):string{
        return `${data.method}:${data.requestUrl}`;
    }

}