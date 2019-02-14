import { Connection } from 'mongoose';
import { Typegoose, prop, arrayProp, Ref } from 'typegoose';
import { Record } from './Record';

export class Commit extends Typegoose{
    _id:string;
    @prop()
    timestamp: Date;
    @prop()
    appkey:string;
    @prop()
    appVersion:string;
    @prop()
    sessionId:string;
    @prop()
    clientIp:string;
    @arrayProp({ itemsRef: Record })
    records: Ref<Record>[];
};

export default (app) => {
    const conn:Connection = app.mongooseDB.get('orginDB'); 
    return new Commit().getModelForClass(Commit, {existingConnection:conn});
}