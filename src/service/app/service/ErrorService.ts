import { Service } from 'egg';

export default class ErrorService extends Service{

    async getErrors(filter:any){
        let aggregate:Array<any> = [];
        if(filter){
            let match:any = {};
            if(filter.type){
                match.type = filter.type;
            }
            if(filter.appkey){
                match.appkey = filter.appkey;
            }
            let start = Number(filter.start);
            if(!Number.isNaN(start)){
                let occurTime = match.occurTime = match.occurTime||{};
                occurTime.$gte = start;
            }
            let end = Number(filter.end);
            if(!Number.isNaN(end)){
                let occurTime = match.occurTime = match.occurTime||{};
                occurTime.$lt = end;
            }
            if(Object.keys(match).length){
                aggregate.push({
                    $match : match
                });
            }
        }
        aggregate.push({
            $group:{
                _id:"$errorId",
                name:{
                    $first:"$name"
                },
                type:{
                    $first:"$type"
                },
                occurTime:{
                    $max:"$occurTime"
                },
                count:{
                    $sum:1
                },
                appkeys: { $addToSet: "$appkey" }
            }
        });

        aggregate.push({ 
            $sort : { occurTime : -1} 
        });
        let pageSize:number = Number(filter.pageSize)||20;
        let pageNumber = Number(filter.pageNumber)||0;
        aggregate.push({
             '$facet' : {
                metadata: [ { $count: "total" }, { $addFields: { pageNumber: Number(pageNumber) } } ],
                data: [ { $skip: pageSize*pageNumber }, { $limit: pageSize } ]
            } 
        })
        let pagedData:any = await this.ctx.model.ErrorRecord.aggregate(aggregate);
        return {
            metadata:pagedData[0].metadata[0]||{total:0},
            data:pagedData[0].data
        };
    }

    async getErrorById(id:string){
        
        let s = await this.ctx.model.ErrorRecord.aggregate([
            {
                $match:{
                    errorId: id
                }
            },{
                $group:{
                    _id:"$errorId",
                    name:{
                        $first:"$name"
                    },
                    type:{
                        $first:"$type"
                    },
                    occurTime:{
                        $max:"$occurTime"
                    },
                    count:{
                        $sum:1
                    },
                    appkeys: { $addToSet: "$appkey" }
                }
            }
        ]);
        return s[0];
    }

}