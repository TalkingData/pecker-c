import { Connection } from 'mongoose';
import { Typegoose, prop, Ref } from 'typegoose';

export class Location extends Typegoose {
  @prop()
  city: string;
  @prop()
  country: string;
  @prop()
  lat: number;
  @prop()
  lon: number;
  @prop()
  org: string;
  @prop()
  proxy: Boolean;
  @prop()
  ip: string;
  @prop()
  regionName: string;
  @prop()
  fail: string;
};

export class StackTrace extends Typegoose {
    @prop()  
    message: string;
    @prop()
    line: string;
    @prop()
    column: string;
    @prop()
    source: string;
    @prop()
    fileName: string;
    @prop()
    errorType: string;
}

export class ErrorRecord extends Typegoose {
  @prop()
  name:string;
  @prop()
  appkey: string;
  @prop()
  occurTime: number;
  @prop()
  type: string;
  @prop()
  url: string;
  @prop()
  title:string;
  @prop() //根据message，行号，列号，文件名计算得到的md5
  errorId: string;
  @prop()
  browserName: string;
  @prop()
  browserVersion: string;
  @prop()
  osName: string;
  @prop()
  osVersion: string;
  @prop()
  engineName: string;
  @prop()
  engineVersion: string;
  @prop()
  userAgent: string;
  @prop()
  location: Ref<Location>;

  // for caughtError
  @prop()
  stacktrace ?: Ref<StackTrace>;
  @prop()
  stacktraceWithSourceMap ?: any;

  // for resourceError
  @prop()
  outerHTML ?: string;
  @prop()
  src ?: string;
  @prop()
  tagName ?: string;

  //for httpError
  @prop()
  requestUrl ?: string;
  @prop()
  method ?: string;
  @prop()
  status ?: number;
  @prop()
  statusText ?: string;
  @prop()
  response ?: string;
};

export default (app) => {
  const conn: Connection = app.mongooseDB.get('orginDB');
  return new ErrorRecord().getModelForClass(ErrorRecord, { existingConnection: conn, schemaOptions: { collection: 'error_records' }});
}