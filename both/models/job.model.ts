import { CollectionObject } from './collection-object.model';

export interface Job extends CollectionObject {
  name: string;
  client: string;
  agency: string;
  thumbUrl?: string;
  public: boolean;
}
