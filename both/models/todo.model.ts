import { CollectionObject } from './collection-object.model';

export interface Todo extends CollectionObject {
  entity: {
    id: string,
    name: string
  };
  user: {
    id: string,
    name: string
  };
  text: string;
  done: string;
}
