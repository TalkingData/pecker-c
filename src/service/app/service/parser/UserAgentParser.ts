import Parser from './Parser';
import * as UA from 'ua-device';

export default class UserAgentParser implements Parser{

    constructor(private userAgent:string){

    }

    parse() {
        let result:any = {};
        result.userAgent = this.userAgent;
        let userAgent = this._parseUserAgent(this.userAgent);
        result.browserName = userAgent.browserName;
        result.browserVersion = userAgent.browserVersion;
        result.osName = userAgent.osName;
        result.osVersion = userAgent.osVersion;
        result.engineName = userAgent.engineName;
        result.engineVersion = userAgent.engineVersion;
        return result;
    }

    _parseUserAgent(userAgent) {
        //var parser = new UAParser();
        //let uaParserParseResult = parser.setUA(userAgent).getResult();
        let uaDeviceParseResult = new UA(userAgent);
        let browserName = uaDeviceParseResult.browser.name;
        let browserVersion = uaDeviceParseResult.browser.version.original;
        let osName = uaDeviceParseResult.os.name;
        let osVersion = uaDeviceParseResult.os.version.original;
        let engineName = uaDeviceParseResult.engine.name;
        let engineVersion = uaDeviceParseResult.engine.version.original;
        return {
            browserName, browserVersion, osName, osVersion, engineName, engineVersion
        }
    }
}