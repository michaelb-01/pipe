import { CollectionObject } from './collection-object.model';

export interface Todo extends CollectionObject {
  _id?: any;
  entity: {
    id: string,
    name: string
  };
  user: string;
  text: string;
  done: boolean;
}
