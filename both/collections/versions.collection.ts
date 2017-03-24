import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Version } from '../models/version.model';

export const Versions = new MongoObservable.Collection<Version>('versions', {idGeneration: 'MONGO'});

function loggedIn() {
  return !!Meteor.user();
}

Versions.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  }
});




