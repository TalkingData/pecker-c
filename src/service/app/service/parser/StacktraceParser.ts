import Parser from './Parser';
import * as errorStackParser from 'error-stack-parser/error-stack-parser'
import * as fs from 'await-fs';
import * as SourceMap from 'source-map';
import { Context } from 'egg';
import { SourceMapList } from '../../model/SourceMapList';

export default class StacktraceParser implements Parser{

    constructor(private stacktrace:string, private appkey:string, private ctx:Context){

    }

    async parse(){
        let result:any = {};
        let parsed = await this._parseStackTrackWithSourceMap(this.stacktrace);
        result.stacktrace = parsed.stacktrace;
        result.stacktraceWithSourceMap = parsed.withSourceMap;
        return result;
    }

    async _parseStackTrackWithSourceMap(stack:string) {
        let withSourceMap: any = {};
        let stacktrace:any = {source:stack};
        if (stack) {
            let message = stack.split("\n")[0];
            let stackFrames = errorStackParser.parse({ stack: stack, message: message, name: "" });
            let first = stackFrames[0];
            if(first){
                stacktrace.message = message;
                stacktrace.line = first.lineNumber;
                stacktrace.column = first.columnNumber;
                stacktrace.fileName = first.fileName;
                stacktrace.errorType = message.split(":")[0];
            }
            withSourceMap.message = message;
            
            let stacks = await Promise.all(stackFrames.map(async (stackFrame) => {
                return await this._getStackTrackWithSourceMap(stackFrame);
            }));
            if (stacks && stacks.length) {
                withSourceMap.stack = stacks,
                withSourceMap.line = stacks[0].line,
                withSourceMap.column = stacks[0].column
            }
        }
        return { stacktrace, withSourceMap};
    }

    async _getStackTrackWithSourceMap(stackFrame) {
        try {
            let fileUrl = stackFrame.fileName;
            
            let sourceMapFileContent = await this.getSourceMapContent(fileUrl);
            // let sourceMap = JSON.parse(sourceMapFileContent);
            let consumer = await new SourceMap.SourceMapConsumer(sourceMapFileContent);
            let c = consumer.originalPositionFor({ line: stackFrame.lineNumber, column: stackFrame.columnNumber });
            return {
                line: c.line,
                column: c.column,
                fileName: c.source,
                functionName: stackFrame.functionName,
                source: stackFrame.source,
                useSourceMap:true
            };
        } catch (error) {
            console.error("Some error happend wehn parse strack track by source map file.", error);
            return {
                line: stackFrame.lineNumber,
                column: stackFrame.columnNumber,
                fileName: stackFrame.fileName,
                functionName: stackFrame.functionName,
                source: stackFrame.source,
                useSourceMap:false
            };
        }

    }

    async getSourceMapContent(fileUrl:string){
        try {
            let fileInfo = await this.ctx.curl(`${fileUrl}.map`, {
                method: "GET",
                dataType: 'json'
            });
            if(fileInfo){
                return fileInfo.data;
            }    
        } catch (error) {
            
        }
        
        console.warn("Not find map file for "+ fileUrl);
        const myURL = new URL(fileUrl);
        let fileName = myURL.pathname.substr(myURL.pathname.lastIndexOf("/")+1);
        let filePath = await this.getSourceMapFilePath(`${fileName}.map`);

        let text = await fs.readFile(filePath);
        return JSON.parse(text)
    }

    async getSourceMapFilePath(fileName){
        let fileInfo:SourceMapList[] = await this.ctx.model.SourceMapList.find({ fileName: fileName, appkey:this.appkey }).sort({updateAt:-1}).limit(1).exec();
        return fileInfo[0]&&fileInfo[0].filePath;
    }

}