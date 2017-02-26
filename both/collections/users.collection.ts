import { MongoObservable } from 'meteor-rxjs';

import { PipeUser } from '../models/user.model';

export const PipeUsers = new MongoObservable.Collection<PipeUser>('pipeUsers', {idGeneration: 'MONGO'});

function loggedIn() {
  return !!Meteor.user();
}

PipeUsers.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
