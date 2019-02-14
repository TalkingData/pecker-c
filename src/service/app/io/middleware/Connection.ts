import { Application } from 'egg';

export default (_app:Application)=>{
    return async(_ctx, next)=>{
        await next();
    }
} 