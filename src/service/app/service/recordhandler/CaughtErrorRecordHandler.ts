import { ErrorRecordHandler } from './ErrorRecordHandler';
import { StackTrace } from '../../model/ErrorRecord';
import StacktraceParser from '../parser/StacktraceParser';
import * as md5 from 'md5';
import { Context } from 'egg';

export default class CaughtErrorRecordHandler extends ErrorRecordHandler{
    
    parse(data: any, commit:any, ctx:Context):StackTrace|{} {
        //parse stack trace
        if (data.stacktrace) {
            return new StacktraceParser(data.stacktrace, commit.appkey, ctx).parse();
        }else{
            return {};
        }
    }


    getErrorId(_data: any, result?:any): string {
        return result.errorId = md5(result.stacktrace.message+result.stacktrace.line+result.stacktrace.column+result.stacktrace.fileName);
    }

    getErrorName(_data: any, result:any):string{
        return result.stacktrace.message;
    }
}