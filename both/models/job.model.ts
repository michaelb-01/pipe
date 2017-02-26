import { CollectionObject } from './collection-object.model';

export interface Job extends CollectionObject {
  name: string;
  client: string;
  agency: string;
  thumbUrl?: string;
  tags?: string[];  // e.g. car, character, environment
  public: boolean;
}
