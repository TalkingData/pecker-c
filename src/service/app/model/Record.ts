import { Connection } from 'mongoose';
import { Typegoose, prop, Ref} from 'typegoose';
import { Commit } from './Commit';

export class Record extends Typegoose{
    @prop()
    type: string;
    @prop({ref:Commit})
    commit:Ref<string>;
    @prop()
    data:any;
};

export default (app) => {
    const conn:Connection = app.mongooseDB.get('orginDB'); 
    return new Record().getModelForClass(Record, {existingConnection:conn});
}