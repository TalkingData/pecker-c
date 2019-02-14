import { Connection } from 'mongoose';
// import { Typegoose, prop } from 'typegoose';
import { Typegoose, prop, Ref } from 'typegoose';

import { Project } from './Project';
import { User } from './User';


export class RoleMap extends Typegoose {
  @prop({ ref: User, required: true })
  user: Ref<User>;
  @prop()
  role: number;
  @prop({ ref: Project, required: true })
  project: Ref<Project>;
  // @prop()
  // project: string;
}

export default app => {
  const conn: Connection = app.mongooseDB.get('orginDB');
  return new RoleMap().getModelForClass(RoleMap, {
    existingConnection: conn,
    schemaOptions: { collection: 'web_rolemap' }
  });
};
