import { CollectionObject } from './collection-object.model';

export interface PipeUser extends CollectionObject {
  name: string;
  entities?: [{
    entity: {
      entityId: string,
      entityName: string
    }
  }];
  email?: string;
  phone?: string;
  roles?: [string];
  photoUrl?: string;
  public: boolean;
}