import * as md5 from "md5";
import { ErrorRecordHandler } from './ErrorRecordHandler';

export default class ResourceErrorRecordHandler extends ErrorRecordHandler{
    parse(data: any) {

        return {
            outerHTML:data.outerHTML,
            src:data.src,
            tagName:data.tagName
        }
    }

    getErrorId(data: any, _parsedResult?: any): string {
        return md5(data.outerHTML + data.src + data.tagName);
    }

    getErrorName(data: any, _result:any):string{
        return data.outerHTML;
    }
}