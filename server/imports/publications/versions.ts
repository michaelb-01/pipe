import { Versions } from '../../../both/collections/versions.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish("versions", function() {
  return Versions.find({ 'public': true });
});