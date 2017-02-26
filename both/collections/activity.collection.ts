import { MongoObservable } from 'meteor-rxjs';

import { Action } from '../models/action.model';

export const Activity = new MongoObservable.Collection<Action>('activity', {idGeneration: 'MONGO'});

function loggedIn() {
  return !!Meteor.user();
}

Activity.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});