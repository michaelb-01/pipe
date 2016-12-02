import { MongoObservable } from 'meteor-rxjs';

import { Entity } from '../models/entity.model';

export const Entities = new MongoObservable.Collection<Entity>('entities', {idGeneration: 'MONGO'});