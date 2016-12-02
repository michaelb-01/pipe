import { Entities } from '../../../both/collections/entities.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish("entities", function() {
  return Entities.find({ 'public': true });
});