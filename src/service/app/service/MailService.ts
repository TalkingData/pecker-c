import * as nodemailer from 'nodemailer'
import { Service } from 'egg'
import { ErrorRecord } from '../model/ErrorRecord'

enum strategy {
    each_error_record = 'each_error_record',
    limit_count_during_time_uint = 'limit_count_during_time_uint'
}
export default class MailService extends Service {
    defaultRule = {
        strategy: 'each_error_record'
    }

    triggerByErrorRecord(appkey: string, _errorRecord: ErrorRecord) {
        let rule = this.getRule(appkey)
        switch (rule.strategy) {
            case strategy.each_error_record:
                this.sentMessageForEachErrorRecord(appkey, _errorRecord)
                break
            default:
                break
        }
    }

    async sentWarningMail(rule: any) {
        let users = await this.queryUsersByAppkey(rule.appkey)
        let maillist = users.map(u => u.email).join(','),
            subject = '云诊预警通知',
            content = this.mailTpl(rule)
        try {
            this.sent(maillist, subject, content)
        } catch (e) {
            console.log(e)
        }
    }

    async sentMessageForEachErrorRecord(appkey: string, errorRecord: any) {
        let users = await this.queryUsersByAppkey(appkey)
        let maillist = users.map(u => u.email).join(',')
        let subject = errorRecord.name
        //    let content = JSON.stringify(_errorRecord);
        let content = `
        <table>
            <thead style='background-color:#ced3d8'>
                <tr>
                    <td>标题</td>
                    <td>值</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>错误名</td>
                    <td>${errorRecord.name}</td>
                </tr>
                <tr>
                    <td>错误标识</td>
                    <td>${errorRecord.errorId}</td>
                </tr>
                <tr>
                    <td>页面</td>
                    <td>${errorRecord.title}</td>
                </tr>
                <tr>
                    <td>发生时间</td>
                    <td>${errorRecord.occurTime}</td>
                </tr>
                <tr>
                    <td>页面URL</td>
                    <td>${errorRecord.url}</td>
                </tr>
                <tr>
                    <td>appkey</td>
                    <td>${errorRecord.appkey}</td>
                </tr>
                <tr>
                    <td>错误类型</td>
                    <td>${errorRecord.type}</td>
                </tr>
                <tr>
                    <td>userAgent</td>
                    <td>${errorRecord.userAgent}</td>
                </tr>
                <tr>
                    <td>错误详情</td>
                    <td>http://172.30.104.152/api/errorrecords/${errorRecord._id}</td>
                </tr>
            </tbody>
        </table>
        `
        await this.sent(maillist, subject, content)
    }

    getRule(_appkey: string) {
        //TODO: 根据appkey获取自定义报警规则
        return this.defaultRule
    }

    mailTpl(data: any): string {
        return `<div style="margin:0 auto;width: 100%;height: 100%;box-sizing: border-box;padding: 30px">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            .mlogo {
                margin: 0 0 20px 0;
            }
            .mline {
                height: 1px;
                background: #e8e8e8;
                border: none;
            }
            .mteam {
                margin: 20px auto;
                text-align: center;
                font-size: 14px;
                color: #959caa;
            }
            .mtable {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                text-align: left;
                border-radius: 4px 4px 0 0;
                font-size: 14px;
                line-height: 1.5;
                color: rgba(0, 0, 0, 0.65);
                border: 1px solid #e8e8e8;
            }
            .mtable thead > tr > th {
                background: rgb(45, 140, 240);
                transition: background 0.3s ease;
                text-align: left;
                color: #fefefe;
                font-weight: 500;
                border-bottom: 1px solid #e8e8e8;
            }
            .mtable th,
            .mtable td {
                line-height: 30px;
                padding: 16px;
                word-break: break-word;
            }
            .mlook {
                width: 100%;
                padding: 30px 0 20px 16px;
                box-sizing: content-box;
                text-align: left;
            }
            .mlook a {
                color: #fd1800;
                text-decoration: none;
                font-size: 16px;
            }
        </style>
        <h1 class="mlogo">
            <img
                src="data:image/png;base64,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"
                alt=""
                style="width: 118px; height: 32px;"
            />
        </h1>
        <table class="mtable">
            <thead>
                <th>项目名称</th>
                <th>预警时间</th>
                <th>错误数量</th>
            </thead>
            <tbody>
                <tr>
                    <td>${data.name}</td>
                    <td>${data.time}</td>
                    <td>${data.total}</td>
                </tr>
            </tbody>
        </table>
        <div class="mlook"><a href="http://172.23.7.73/#/erroroverview/${data.id}">查看详细&nbsp;&gt;</a></div>
        <hr class="mline" />
        <div class="mteam">&copy;云诊团队</div>
    </div>`
    }

    async queryUsersByAppkey(appkey: string) {
        let result: Array<any> = await this.ctx.model.Project.aggregate([
            {
                $match: {
                    appkey: appkey
                }
            },
            {
                $lookup: {
                    from: 'web_rolemap',
                    localField: '_id',
                    foreignField: 'project',
                    as: 'rolemap'
                }
            },
            {
                $lookup: {
                    from: 'web_user',
                    localField: 'rolemap.user',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            {
                $project: {
                    'users.email': 1,
                    'users.name': 1
                }
            }
        ])
        if (result.length) {
            return result[0].users
        } else {
            return []
        }
    }

    async sent(maillist: string, subject: string, content: string) {
        let result = new Promise((resolver, _reject) => {
            let transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'yunzhen@tendcloud.com',
                    pass: 'tdyz@10212019'
                },
                requireTLS: true
            })

            let mailOptions = {
                from: '"云诊" <yunzhen@tendcloud.com>',
                to: maillist,
                subject: subject,
                text: content,
                html: content
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Sent email failed to: ', maillist)
                    console.log(error)
                }
                if (info) {
                    console.log('Sent email success to: ', maillist)
                    resolver(info)
                } else {
                    resolver(false)
                }
            })
        })
        return result
    }
}
