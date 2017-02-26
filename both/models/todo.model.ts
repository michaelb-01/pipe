import { CollectionObject } from './collection-object.model';

export interface Todo extends CollectionObject {
  entity: {
    id: string,
    name: string
  };
  user: string;
  text: string;
  done: string;
}
