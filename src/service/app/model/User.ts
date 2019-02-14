'use strict';
import { Connection } from 'mongoose';
import { Typegoose, prop } from 'typegoose';


export class User extends Typegoose {
  @prop()
  name: string;
  @prop()
  password: string;
  @prop()
  email: string;
}

export default app => {
  const conn: Connection = app.mongooseDB.get('orginDB');
  return new User().getModelForClass(User, {
    existingConnection: conn,
    schemaOptions: { collection: 'web_user' }
  });
};
