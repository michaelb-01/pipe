import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Entity } from '../models/entity.model';

export const Entities = new MongoObservable.Collection<Entity>('entities', {idGeneration: 'MONGO'});

function loggedIn() {
  return !!Meteor.user();
}

Entities.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});