import { Activity } from '../../../both/collections/activity.collection';
import { Meteor } from 'meteor/meteor';

Meteor.publish("activity", function() {
  return Activity.find({public:true});
});