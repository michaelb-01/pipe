import { Mongo } from 'meteor/mongo';

export interface CollectionObject {
  _id?: Mongo.ObjectID;
}