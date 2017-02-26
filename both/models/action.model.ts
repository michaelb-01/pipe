import { CollectionObject } from './collection-object.model';

export interface Action extends CollectionObject {
  author: {
    id:string;
    name:string;
  }
  meta: {
    name: string;
    type: string;
    jobId: string;
  }
  tags?: [string];
  date: Date;
  public: boolean;
}
