import { CollectionObject } from './collection-object.model';

export interface Todo extends CollectionObject {
  user: {
    id: string,
    name: string
  };
  text: string;
  done: boolean;
}
