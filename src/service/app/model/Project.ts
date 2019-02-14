import { Connection } from 'mongoose';
import { Typegoose, prop} from 'typegoose';

export class Project extends Typegoose {
    @prop()
    name: string;
    @prop()
    appkey: string;
    @prop()
    language: string;
    @prop()
    framework: string
  }
  
  export default app => {
    const conn: Connection = app.mongooseDB.get('orginDB');
    return new Project().getModelForClass(Project, {
      existingConnection: conn,
      schemaOptions: { collection: 'web_project' }
    });
  };