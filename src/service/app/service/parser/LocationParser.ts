import Parser from './Parser';

export default class LocationParser implements Parser{

    constructor(private ctx:any, private commit:any){}

    async parse() {
        let result:any = {};
        //parse location by client ip
        result.location = await this._queryLocationByIp(this.commit.clientIp);
        return result;
    }


    async _queryLocationByIp(ip) {
        let result: any = { ip: ip };
        if (ip && ip != '127.0.0.1') {
            let location = await this.ctx.curl(`http://ip-api.com/json/${ip}?fields=520191&lang=zh-CN`, {
                method: "GET",
                dataType: 'json'
            });
            if (location.data.status == 'fail') {
                // private range	the IP address is part of a private range - more info
                // reserved range	the IP address is part of a reserved range - more info
                // invalid query	invalid IP address or domain name
                // quota    over quota
                if (location.data.message == "private range") {
                    result.fail = "私有网络IP";
                }
                if (location.data.message == "reserved range") {
                    result.fail = "储备网络IP";
                }
                if (location.data.message == "invalid query") {
                    result.fail = "无效IP";
                }
                if (location.data.message == "quota") {
                    result.fail = "超出配额";
                }
            } else {
                result.city = location.data.city, //张家口市
                    result.country = location.data.country, //中国
                    result.lat = location.data.lat, //122.11
                    result.lon = location.data.lon, //90.2
                    result.org = location.data.org, //"China Telecom Beijing",
                    result.proxy = location.data.proxy, //true
                    result.ip = ip, //9.11.222.11
                    result.regionName = location.data.regionName //河北省
            }
        }
        return result;
    }
}