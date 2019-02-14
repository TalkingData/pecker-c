import Parser from './Parser';

export default class BasicParser implements Parser{
    constructor(private record:any, private commit:any){}

    parse() {
        let result:any = {};
        //some basic info
        let data = this.record.data;
        result.occurTime = data.occurTime;
        result.type = this.record.type;
        result.url = data.url;
        result.title = data.title;
        result.appkey = this.commit.appkey;
        return result;
    }

}