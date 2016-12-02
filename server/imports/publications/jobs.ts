import { Jobs } from '../../../both/collections/jobs.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish("jobs", function() {
  return Jobs.find({ 'public': true });
});