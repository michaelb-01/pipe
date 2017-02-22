import { CollectionObject } from './collection-object.model';

export interface Entity extends CollectionObject {
  job: {
    jobId: string,
    jobName: string
  };
  name: string;
  type: string;
  tasks: any[];
  status: string;
  thumbUrl?: string;
  description?: string;
  todos?: any[];  
  public: boolean;
}
