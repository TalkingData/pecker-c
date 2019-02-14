import { Connection } from 'mongoose';
import { Typegoose, prop, Ref } from 'typegoose';
import { SourceMapList } from './SourceMapList';

export class SourceMap extends Typegoose {
  @prop()
  appkey: string;
  @prop()
  version: string;
  @prop({ default: Date.now })
  uploadAt: Date;
  @prop({ ref: SourceMapList, required: true })
  sourceMaps: Ref<SourceMapList>;


}

export default (app) => {
  const conn: Connection = app.mongooseDB.get('orginDB');
  return new SourceMap().getModelForClass(SourceMap, { existingConnection: conn });
}