/**
 * map for sm
 */
import { Connection } from 'mongoose';
import { Typegoose, prop, pre } from 'typegoose';

// interface Meta {
//   createAt: number;
//   updateAt: number;
// }
// class Meta {
//   @prop({ default: Date.now() })
//   createAt?: number;

//   @prop({ default: Date.now() })
//   updateAt?: number;
// }

@pre<SourceMapList>('save', function (next) {
  if (this.isNew) {
    this.createAt = this.updateAt = Date.now()
  } else {
    this.updateAt = Date.now()
  }

  next()
})
export class SourceMapList extends Typegoose {
  @prop()
  appkey: string;
  // @prop()
  // version: string;
  @prop()
  fileName: string;
  @prop()
  filePath: string;
  // @prop()
  // meta: Meta
  @prop({ default: Date.now() })
  createAt: number;

  @prop({ default: Date.now() })
  updateAt: number;


}

export default (app) => {
  const conn: Connection = app.mongooseDB.get('orginDB');
  return new SourceMapList().getModelForClass(SourceMapList, { existingConnection: conn, schemaOptions: { collection: 'source_map' } });
}