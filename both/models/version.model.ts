import { CollectionObject } from './collection-object.model';

export interface Version extends CollectionObject {
  job: {
    jobId: string,
    jobName: string
  };
  entity: {
    entityId: string,
    entityName: string
  };
  author: string;
  version: number;
  //frames: number;
  notes?: [any];
  review: [any];
  contentType: string;
  taskType: {
    type: string,
    idx: number
  };
  content?: string;
  description?: string;
  date?: Date;
  public: boolean;
}
