import { Service } from 'egg';

export default class ErrorRecordStatisticService extends Service{
    
    async statisticByOccurTime(appkey:string, start:number, end:number, groupby?:"hour"|"day"|"month"|"week"){

        let aggregate:Array<any> = [];
        let dateProject = {
            $project:{
                occurTime:1,
                date:{
                    '$add': [
                        new Date(0),
                        '$occurTime'
                    ]
                }
            }
        };
        
            let match:any = {
                appkey: appkey 
            };
            
            if(!Number.isNaN(start)){
                match.occurTime = match.occurTime||{};
                match.occurTime.$gte = start;
            }
            if(!Number.isNaN(end)){
                match.occurTime = match.occurTime||{};
                match.occurTime.$lt = end;
            }
            
        if(!groupby){
            if(!Number.isNaN(start)&&!Number.isNaN(end)){
                groupby = (end-start)>1000*60*60*24 ? "day" : "hour";
            }else{
                groupby = "day";
            }
        }

        let group:any = {$group:{}};
        let project:any = {$project:{
            _id:0,
            count:1
        }};
        let sort:any = {};
        if(groupby=='hour'){
            group.$group._id = { hour:{$hour:"$date"}, month: { $month: "$date" }, day: { $dayOfMonth: "$date" }, year: { $year: "$date" } };
            group.$group.count = {
                $sum:1
            }
            project.$project.hour="$_id.hour";
            project.$project.year="$_id.year";
            project.$project.month="$_id.month";
            project.$project.day="$_id.day";
            sort = { year:1, month:1, day:1, hour:1 };
        }else if(groupby=='day'){
            group.$group._id = { month: { $month: "$date" }, day: { $dayOfMonth: "$date" }, year: { $year: "$date" } };
            group.$group.count = {
                $sum:1
            }
            project.$project.year="$_id.year";
            project.$project.month="$_id.month";
            project.$project.day="$_id.day";
            sort = { year:1, month:1, day:1 };
        }else if(groupby=='month'){
            group.$group._id = { month: { $month: "$date" }, year: { $year: "$date" } };
            group.$group.count = {
                $sum:1
            };
            project.$project.year="$_id.year";
            project.$project.month="$_id.month";
            sort = { year:1, month:1 };
        }else if(groupby=='week'){
            group.$group._id = { week: { $isoWeek: "$date" }, year: { $year: "$date" } };
            group.$group.count = {
                $sum:1
            }
            project.$project.year="$_id.year";
            project.$project.week="$_id.week";
            sort = { year:1, week:1 };
        }
        project.$project.groupby = groupby;
        aggregate.push({ $match : match });
        aggregate.push(dateProject);
        aggregate.push(group);
        aggregate.push(project);
        aggregate.push({$sort:sort});
        return await this.ctx.model.ErrorRecord.aggregate(aggregate);
    }
}