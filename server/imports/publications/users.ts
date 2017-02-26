import { PipeUsers } from '../../../both/collections/users.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish("pipeUsers", function() {
  return PipeUsers.find();
});


