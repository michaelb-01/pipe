import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Job } from '../models/job.model';

export const Jobs = new MongoObservable.Collection<Job>('jobs', {idGeneration: 'MONGO'});

function loggedIn() {
  return !!Meteor.user();
}
 
Jobs.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});